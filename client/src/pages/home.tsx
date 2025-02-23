import { ResumeForm } from "@/components/resume-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">AI Resume Builder</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ResumeForm />
      </main>
    </div>
  );
}