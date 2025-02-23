import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">AI Resume Builder</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="order-2 lg:order-1">
            <ResumePreview />
          </div>
          <div className="order-1 lg:order-2">
            <ResumeForm />
          </div>
        </div>
      </main>
    </div>
  );
}