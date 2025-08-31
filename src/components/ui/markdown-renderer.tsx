import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:text-foreground prose-headings:font-semibold",
        "prose-p:text-foreground prose-p:leading-relaxed prose-p:my-2",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:text-foreground prose-em:italic",
        "prose-ul:text-foreground prose-ol:text-foreground",
        "prose-li:text-foreground prose-li:my-1",
        "prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs",
        "prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:rounded-md",
        "prose-blockquote:text-muted-foreground prose-blockquote:border-l-border",
        "prose-hr:border-border",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        // Ensure responsive text sizing
        "text-sm leading-relaxed",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom paragraph component to handle spacing
          p: ({ children }) => (
            <p className="mb-2 last:mb-0">{children}</p>
          ),
          // Custom strong component for consistent styling
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          // Custom emphasis component
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          // Custom list components for better spacing
          ul: ({ children }) => (
            <ul className="space-y-1 pl-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1 pl-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground">{children}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};