import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/contrib/mhchem.mjs";

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose-chem">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
