import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TruncatedContentProps {
  content: string;
  maxHeight?: number;
  previewLines?: number;
  className?: string;
  showExpandButton?: boolean;
  onExpand?: () => void;
}

export const TruncatedContent = ({ 
  content, 
  maxHeight = 200, 
  previewLines = 3,
  className,
  showExpandButton = true,
  onExpand
}: TruncatedContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate if content needs truncation
  const lines = content.split('\n');
  const needsTruncation = lines.length > previewLines || content.length > 500;
  
  // Get preview content (first few lines)
  const previewContent = needsTruncation && !isExpanded 
    ? lines.slice(0, previewLines).join('\n') + '...'
    : content;

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOpenModal = () => {
    onExpand?.();
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "transition-all duration-300",
        !isExpanded && needsTruncation && `max-h-[${maxHeight}px] overflow-hidden`
      )}>
        {isExpanded ? (
          <ScrollArea className="max-h-[400px] pr-2">
            <MarkdownRenderer content={content} />
          </ScrollArea>
        ) : (
          <MarkdownRenderer content={previewContent} />
        )}
      </div>
      
      {needsTruncation && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpanded}
            className="glass-light hover:glass-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More
              </>
            )}
          </Button>
          
          {showExpandButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenModal}
              className="glass-light hover:glass-medium"
            >
              <Expand className="h-4 w-4 mr-1" />
              Full Screen
            </Button>
          )}
        </div>
      )}
      
      {!isExpanded && needsTruncation && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      )}
    </div>
  );
};