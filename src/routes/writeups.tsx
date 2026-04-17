import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";

export const Route = createFileRoute("/writeups")({
  head: () => ({
    meta: [
      { title: "Writeups — Mostafa Galal" },
      {
        name: "description",
        content:
          "Bug bounty findings, red team learnings, and CTF achievements by Mostafa Galal.",
      },
      { property: "og:title", content: "Writeups — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Bug bounty findings, red team learnings, and CTF achievements by Mostafa Galal.",
      },
    ],
  }),
  component: WriteupsPage,
});

const POSTS = [
  {
    slug: "snapchat-smtp-open-relay",
    date: "2025-05-15",
    tags: ["bug bounty", "smtp"],
    title: "Snapchat SMTP Open Relay Vulnerability",
    excerpt:
      "How a missing auth check on beta.snappublisher.snapchat.com let me relay arbitrary email through Snapchat's infrastructure.",
  },
  {
    slug: "tryhackme-three-season-streak",
    date: "2025-09-01",
    tags: ["tryhackme", "red team"],
    title: "TryHackMe Leaderboards: 1st Place Across Three Seasons",
    excerpt:
      "Bronze, Gold, and Sapphire — what it took to top the global leaderboard three seasons in a row.",
  },
  {
    slug: "journey-into-red-teaming",
    date: "2025-05-20",
    tags: ["learning", "red team"],
    title: "My Journey into Red Teaming",
    excerpt:
      "Balancing a Communications & Electronics Engineering degree with self-directed offensive security study.",
  },
];

function WriteupsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="notes::field"
          title="Writeups, research, and reflections"
          description="Long-form notes from bug bounty work, competitions, and the learning process itself."
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
