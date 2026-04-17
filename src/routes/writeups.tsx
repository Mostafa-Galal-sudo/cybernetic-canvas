import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";

export const Route = createFileRoute("/writeups")({
  head: () => ({
    meta: [
      { title: "Writeups — [Your Name]" },
      {
        name: "description",
        content:
          "CTF solves, vulnerability research, and notes from the field by [Your Name].",
      },
      { property: "og:title", content: "Writeups — [Your Name]" },
      {
        property: "og:description",
        content:
          "CTF solves, vulnerability research, and notes from the field by [Your Name].",
      },
    ],
  }),
  component: WriteupsPage,
});

const POSTS = [
  {
    slug: "racing-the-jwt",
    date: "2025-03-12",
    tags: ["web", "auth"],
    title: "Racing the JWT: a story of one millisecond",
    excerpt:
      "How a tiny race in a token refresh endpoint let us mint admin sessions on demand.",
  },
  {
    slug: "ebpf-rootkit-postmortem",
    date: "2025-01-28",
    tags: ["kernel", "linux"],
    title: "An eBPF rootkit, and how we caught it",
    excerpt:
      "From the first weird metric to the kernel module pinned in /sys.",
  },
  {
    slug: "ctf-pwn-heap",
    date: "2024-11-04",
    tags: ["pwn", "ctf"],
    title: "Heap feng shui in 2024 — still a thing",
    excerpt:
      "Walkthrough of the toughest pwn challenge in [CTF Name], with code.",
  },
  {
    slug: "supply-chain-poisoning",
    date: "2024-09-18",
    tags: ["supply-chain", "ci"],
    title: "Poisoning a supply chain through 3 lines of YAML",
    excerpt:
      "Why your GitHub Actions cache is more dangerous than you think.",
  },
  {
    slug: "cloud-iam-attack",
    date: "2024-07-02",
    tags: ["aws", "iam"],
    title: "Lateral movement via overly-helpful IAM roles",
    excerpt:
      "A red team engagement walkthrough, names changed to protect the guilty.",
  },
  {
    slug: "fuzzing-grpc",
    date: "2024-04-21",
    tags: ["fuzzing", "grpc"],
    title: "Fuzzing gRPC services without losing your mind",
    excerpt:
      "A reusable harness, a coverage tool, and a few crashes.",
  },
];

function WriteupsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="notes::field"
          title="Writeups, research, and CTF solves"
          description="Long-form notes from engagements I'm allowed to talk about — and the ones I'm not."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {POSTS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <Link
              to="/writeups/$slug"
              params={{ slug: p.slug }}
              className="group relative block h-full overflow-hidden rounded-2xl p-6 glass-panel gradient-border corner-brackets transition-shadow hover:shadow-[0_0_40px_oklch(0.85_0.18_200/0.25)]"
            >
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {p.date}
                </span>
                <span className="inline-flex items-center gap-1 text-cyber-cyan">
                  <Tag className="h-3 w-3" /> {p.tags.join(" / ")}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold leading-snug transition-colors group-hover:text-gradient-cyber">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-cyber-cyan">
                Read writeup{" "}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
