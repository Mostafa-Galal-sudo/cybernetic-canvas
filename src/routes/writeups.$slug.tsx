import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  body: string;
};

const POSTS: Record<string, Post> = {
  "snapchat-smtp-open-relay": {
    slug: "snapchat-smtp-open-relay",
    title: "Snapchat SMTP Open Relay Vulnerability",
    date: "2025-05-15",
    tags: ["smtp", "bug bounty", "email security", "reconnaissance"],
    body: `During a bug bounty engagement, I discovered an SMTP open relay vulnerability on beta.snappublisher.snapchat.com. This allowed unauthenticated users to send email through Snapchat's infrastructure.

## Proof-of-Concept

\`\`\`
telnet beta.snappublisher.snapchat.com 25
220 beta.snappublisher.snapchat.com ESMTP
HELO attacker.com
250 beta.snappublisher.snapchat.com
MAIL FROM:<test@external.com>
250 OK
RCPT TO:<recipient@gmail.com>
250 OK
DATA
354 End data with <CR><LF>.<CR><LF>
Subject: Test Message

This is a test message.
.
250 OK
\`\`\`

The server successfully relayed the message, confirming the vulnerability. I reported this to Snapchat with a video PoC and recommended restricting SMTP relay to authenticated users only.

## Impact

This vulnerability could be abused for phishing or large-scale spam campaigns, posing a significant risk to brand reputation and user trust.

## Recon Tools Used

Subfinder, httpx, swaks.

## Key Takeaway

A full bug bounty workflow — from reconnaissance and exploitation to responsible disclosure and reporting.`,
  },
  "tryhackme-three-season-streak": {
    slug: "tryhackme-three-season-streak",
    title: "TryHackMe Leaderboards: 1st Place Across Three Seasons",
    date: "2025-09-01",
    tags: ["tryhackme", "red team", "achievements"],
    body: `Achieved 1st place globally on TryHackMe leaderboards across three competitive seasons, demonstrating consistency, discipline, and advanced offensive security capabilities.

## Achievements

- **Bronze League** — 1st Place (rarity 5.2%)
- **Gold League** — 1st Place (rarity 1.7%)
- **Sapphire League** — 1st Place (rarity 0.8%, Epic Tier)

These rankings reflect sustained hands-on practice in real-world attack simulations, including enumeration, exploitation, privilege escalation, and post-exploitation across diverse lab environments.

## Focus Areas

- Web and Network Exploitation
- Privilege Escalation
- Active Directory Labs
- Red Team Methodology

## Takeaway

Consistency outweighs short-term effort. Structured learning, daily practice, and an offensive mindset are the key drivers of top-tier performance on competitive security platforms.`,
  },
  "journey-into-red-teaming": {
    slug: "journey-into-red-teaming",
    title: "My Journey into Red Teaming",
    date: "2025-05-20",
    tags: ["red teaming", "learning", "engineering"],
    body: `My journey into red teaming has been both demanding and rewarding while pursuing a degree in Communications and Electronics Engineering. Balancing an intensive academic workload with hands-on cybersecurity practice has shaped my learning approach and time management skills.

Unlike traditional penetration testing, red teaming focuses on emulating real-world adversaries to evaluate an organization's overall security posture. My interest in this field grew naturally from my engineering background, where low-level system understanding is essential.

## Key Challenges

- Balancing engineering coursework with cybersecurity learning
- Frequent context switching between theory-heavy subjects and practical labs
- Limited time requiring depth-focused learning strategies
- Self-directed study due to the absence of red teaming in academic curricula

## Validation Through Competition

- **CyberTalents** — Ranked 20th out of 250 participants
- **CyShield** — Top 100 placement

These experiences strengthened my analytical thinking, persistence, and ability to learn complex systems efficiently.

## Looking Ahead

I'm actively preparing for future competitions and challenges, including upcoming CyberTalents editions, Zinad cybersecurity competitions, and advanced red team simulation labs currently in progress.

Each milestone reinforces my commitment to mastering offensive security through strong engineering fundamentals and continuous learning.`,
  },
};

export const Route = createFileRoute("/writeups/$slug")({
  loader: ({ params }) => {
    const post = POSTS[params.slug];
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Writeups — Mostafa Galal` },
          { name: "description", content: loaderData.post.body.slice(0, 160) },
          { property: "og:title", content: `${loaderData.post.title} — Mostafa Galal` },
          { property: "og:description", content: loaderData.post.body.slice(0, 160) },
        ]
      : [{ title: "Writeup — Mostafa Galal" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center sm:px-6">
      <div className="font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
        err::404
      </div>
      <h1 className="mt-4 font-display text-4xl font-bold">Writeup not found</h1>
      <Link
        to="/writeups"
        className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> back to writeups
      </Link>
    </div>
  ),
  component: WriteupDetail,
});

function WriteupDetail() {
  const { post } = Route.useLoaderData();

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
        <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {post.date}
          </span>
          <span className="inline-flex items-center gap-1 text-cyber-cyan">
            <Tag className="h-3 w-3" /> {post.tags.join(" / ")}
          </span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
          {post.title}
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="prose prose-invert mt-10 max-w-none space-y-5 text-foreground/85">
          {post.body.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="mt-8 font-display text-2xl font-semibold text-foreground"
                >
                  {block.replace(/^##\s/, "")}
                </h2>
              );
            }
            if (block.startsWith("```")) {
              const code = block.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
              return (
                <pre
                  key={i}
                  className="overflow-x-auto rounded-xl p-4 font-mono text-xs glass-panel gradient-border"
                >
                  <code>{code}</code>
                </pre>
              );
            }
            if (block.startsWith("- ")) {
              return (
                <ul key={i} className="ml-5 list-disc space-y-1.5">
                  {block.split("\n").map((li, j) => (
                    <li key={j}>{li.replace(/^-\s/, "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="leading-relaxed">
                {block}
              </p>
            );
          })}
        </div>
      </Reveal>
    </article>
  );
}
