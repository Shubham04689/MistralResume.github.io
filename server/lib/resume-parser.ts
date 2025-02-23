import { ResumeData } from "@shared/schema";

export async function parseResume(
  buffer: Buffer,
  filename: string
): Promise<ResumeData> {
  const fileType = filename.split(".").pop()?.toLowerCase();

  let text = "";
  if (fileType === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    text = data.text;
  } else if (fileType === "doc" || fileType === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (fileType === "json") {
    try {
      const data = JSON.parse(buffer.toString());
      // Validate against our schema
      if (
        typeof data === "object" &&
        data !== null &&
        "contact" in data &&
        "summary" in data
      ) {
        return data as ResumeData;
      }
      throw new Error("Invalid resume JSON structure");
    } catch (error) {
      throw new Error("Invalid JSON file");
    }
  } else {
    throw new Error("Unsupported file type");
  }

  // Basic parsing logic - this can be enhanced with NLP
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
  const linkedInMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/);

  return {
    contact: {
      fullName: "",
      email: emailMatch?.[0] || "",
      phone: phoneMatch?.[0] || "",
      location: "",
      linkedIn: linkedInMatch?.[0] || "",
      website: "",
    },
    summary: "",
    education: [{
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      achievements: [],
    }],
    experience: [{
      company: "",
      position: "",
      startDate: "",
      description: "",
      achievements: [],
      technologies: [],
    }],
    skills: [{
      category: "Technical Skills",
      items: [],
      proficiency: "intermediate",
    }],
    projects: [],
    languages: [],
  };
}