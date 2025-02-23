import React, { useState } from "react";
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

  const formatSuggestionContent = (rawContent: string) => {
    return rawContent
      .replace(/\n{2,}/g, '<br/><br/>') // Preserve paragraph breaks
      .replace(/\n/g, '<br/>')          // Convert single newlines to breaks
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic text
  };

  const getSuggestionContent = () => {
    const rawContent = suggestion.suggestion || "";
    const formattedContent = formatSuggestionContent(rawContent);
    return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedContent }} />;
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
            {getSuggestionContent()}
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-full"
              onClick={() => {
                onUseSuggestion(suggestion.suggestion || "");
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

<style>{`
  .whitespace-pre-wrap {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.6;
  }
`}</style>