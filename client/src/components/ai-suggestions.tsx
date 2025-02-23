import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AiSuggestionsProps {
  section: string;
  content: string;
}

export function AiSuggestions({ section, content }: AiSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const { toast } = useToast();

  async function getSuggestion() {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/suggest", { section, content });
      const data = await res.json();
      setSuggestion(data.suggestion);
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
        ) : suggestion ? (
          <div className="space-y-2">
            <p className="text-sm">{suggestion}</p>
            <Button size="sm" variant="secondary" className="w-full">
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
