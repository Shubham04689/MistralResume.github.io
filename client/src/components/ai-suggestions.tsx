import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AiSuggestionsProps {
  section: string;
  content: string;
  onUseSuggestion: (suggestion: string) => void;
}

type SuggestionResponse = {
  experience?: { description: string; achievements: string[]; keywords: string[] };
  education?: { description: string; highlights: string[] };
  skills?: { skills: string[]; categories: string[] };
  summary?: { summary: string; keywords: string[] };
  suggestion?: string;
};

export function AiSuggestions({ section, content, onUseSuggestion }: AiSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestionResponse>({});
  const { toast } = useToast();

  async function getSuggestion() {
    setLoading(true);
    try {
      const response = await apiRequest<SuggestionResponse>("POST", "/api/suggest", { section, content });
      setSuggestion(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI suggestion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const getSuggestionContent = () => {
    if (suggestion.experience) {
      return suggestion.experience.description;
    } else if (suggestion.education) {
      return suggestion.education.description;
    } else if (suggestion.skills) {
      return suggestion.skills.skills.join(", ");
    } else if (suggestion.summary) {
      return suggestion.summary.summary;
    }
    return suggestion.suggestion || "";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => getSuggestion()}
          disabled={loading}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Get AI Suggestion
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {loading ? (
          <p className="text-sm text-muted-foreground">Generating suggestion...</p>
        ) : getSuggestionContent() ? (
          <div className="space-y-2">
            <p className="text-sm">{getSuggestionContent()}</p>
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-full"
              onClick={() => {
                onUseSuggestion(getSuggestionContent());
                setSuggestion({});
              }}
            >
              Use Suggestion
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click to get AI-powered suggestions for this section
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}