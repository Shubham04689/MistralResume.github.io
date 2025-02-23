import { ResumeData, resumeSchema } from "@shared/schema";

const defaultResumeStructure: ResumeData = {
  contact: { fullName: "", email: "", phone: "", location: "", linkedIn: "", website: "" },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  languages: []
};

export async function parseResume(
  buffer: Buffer,
  filename: string
): Promise<ResumeData> {
  const fileType = filename.split(".").pop()?.toLowerCase();

  let text = "";
  try {
    if (fileType === "pdf") {
      const pdfjs = await import("pdfjs-dist");
      const doc = await pdfjs.getDocument({ data: buffer }).promise;
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
    } else if (fileType === "doc" || fileType === "docx") {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (fileType === "json") {
      try {
        const jsonData = JSON.parse(buffer.toString());
        
        // Return parsed data without validation
        return {
          ...defaultResumeStructure,
          ...jsonData,
          contact: {
            ...defaultResumeStructure.contact,
            ...jsonData.contact
          }
        };
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error("Invalid JSON syntax");
        }
        throw error instanceof Error ? error : new Error("Invalid JSON structure");
      }
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    throw new Error(`File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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