import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/writeups/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Writeups — [Your Name]` },
      {
        name: "description",
        content: `Security writeup: ${params.slug}.`,
      },
      { property: "og:title", content: `${params.slug} — Writeups — [Your Name]` },
      {
        property: "og:description",
        content: `Security writeup: ${params.slug}.`,
      },
    ],
  }),
  component: WriteupDetail,
});

function WriteupDetail() {
  const { slug } = Route.useParams();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Reveal>
        <Link
          to="/writeups"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> back to writeups
        </Link>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
          slug::{slug}
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
          {slug.replace(/-/g, " ")}
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="prose prose-invert mt-10 max-w-none text-foreground/85">
          <p>
            [This is a placeholder writeup body. Replace this content with the
            real story — the target, the recon, the bug, the exploitation
            chain, and the remediation guidance you delivered.]
          </p>
          <p>
            [Add code blocks, screenshots, and diagrams as needed. The styling
            already supports a long-form reading experience.]
          </p>
          <pre className="mt-6 overflow-x-auto rounded-xl p-4 font-mono text-sm glass-panel gradient-border">
            <code>{`# example
$ nmap -sV -p- target.tld
$ ffuf -u https://target.tld/FUZZ -w wordlist.txt`}</code>
          </pre>
          <p>
            [Wrap up with takeaways for both attackers and defenders.]
          </p>
        </div>
      </Reveal>
    </article>
  );
}
