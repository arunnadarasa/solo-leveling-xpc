import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { Copy, Expand, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExpandedResponseModalProps {
  title: string;
  content: string;
  confidence?: number;
  sessionId?: string;
  generatedDate?: string;
  children: React.ReactNode;
}

export const ExpandedResponseModal = ({ 
  title, 
  content, 
  confidence,
  sessionId,
  generatedDate,
  children 
}: ExpandedResponseModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "AI consultation response has been copied.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] glass-card border-primary/20">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-primary">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {confidence && (
                <Badge variant="secondary" className="glass-light">
                  {confidence}% Confidence
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="glass-light hover:glass-medium"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          {sessionId && generatedDate && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-primary/10">
              <span>Session: {sessionId.substring(0, 12)}...</span>
              <span>Generated: {new Date(generatedDate).toLocaleString()}</span>
            </div>
          )}
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            <MarkdownRenderer 
              content={content}
              className="text-sm leading-relaxed"
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};