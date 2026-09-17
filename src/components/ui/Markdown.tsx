import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";

/** Element styles for agent replies, all from theme tokens. */
const components: Components = {
  p: (props) => <p className="my-2 first:mt-0 last:mb-0" {...props} />,
  // In-app paths (e.g. linked record ids) stay in this tab; everything else opens a new one.
  a: ({ href, children, ...props }) =>
    href?.startsWith("/") ? (
      <Link href={href} className="font-medium text-accent underline underline-offset-2">
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer" className="font-medium text-accent underline underline-offset-2" {...props}>
        {children}
      </a>
    ),
  ul: (props) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-faint" {...props} />,
  ol: (props) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-faint" {...props} />,
  h1: (props) => <h3 className="mb-2 mt-4 text-lg font-semibold first:mt-0" {...props} />,
  h2: (props) => <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0" {...props} />,
  h3: (props) => <h4 className="mb-1.5 mt-3 font-sans text-base font-semibold first:mt-0" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  blockquote: (props) => <blockquote className="my-2 border-l-2 border-line pl-3 text-muted" {...props} />,
  hr: () => <hr className="my-4 border-line" />,
  code: ({ className, children, ...props }) =>
    className ? (
      <code className={cn("font-mono text-sm", className)} {...props}>{children}</code>
    ) : (
      <code className="rounded-[5px] bg-raised px-1 py-0.5 font-mono text-[0.9em] ring-1 ring-inset ring-line" {...props}>
        {children}
      </code>
    ),
  pre: (props) => (
    <pre className="my-3 overflow-x-auto rounded-[10px] border border-line bg-raised p-3 font-mono text-sm leading-relaxed" {...props} />
  ),
  table: (props) => (
    <div className="my-3 overflow-x-auto rounded-[10px] border border-line">
      <table className="w-full border-collapse text-left text-sm tabular-nums" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-line bg-raised px-3 py-2 font-medium" {...props} />,
  td: (props) => <td className="border-b border-line px-3 py-2 align-top last:border-b-0" {...props} />,
};

/** Single newlines are real line breaks: the agent writes "Heading:\nlist" without blank lines. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("min-w-0 text-sm leading-relaxed text-ink [overflow-wrap:anywhere]", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
