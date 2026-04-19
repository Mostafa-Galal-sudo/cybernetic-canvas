import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { Spine, SpineCard } from "@/components/Spine";
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

const EASE = [0.22, 1, 0.36, 1] as const;

const tagVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

type Post = (typeof POSTS)[number];

function WriteupCard({ post }: { post: Post }) {
  return (
    <TiltCard intensity={6} className="group h-full rounded-2xl">
      <Link
        to="/writeups/$slug"
        params={{ slug: post.slug }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl p-6 glass-panel gradient-border corner-brackets"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyber-cyan/6 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
          className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          <motion.span variants={tagVariants} className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {post.date}
          </motion.span>
          {post.tags.map((tag) => (
            <motion.span
              key={tag}
              variants={tagVariants}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyber-cyan ring-1 ring-cyber-cyan/30 bg-cyber-cyan/5"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <h3 className="mt-4 font-display text-2xl font-semibold leading-snug transition-colors duration-300 group-hover:text-gradient-cyber">
          {post.title}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/75">
          {post.excerpt}
        </p>

        <div className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-cyber-cyan">
          Read writeup
          <motion.span
            className="inline-flex"
            whileHover={{ x: 3, y: -3 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </motion.span>
        </div>
      </Link>
    </TiltCard>
  );
}

function WriteupsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="notes::field"
          title="Writeups, research, and reflections"
          description="Long-form notes from bug bounty work, competitions, and the learning process itself."
        />
      </Reveal>

      <Spine className="mt-16">
        <ul className="space-y-14">
          {POSTS.map((p, i) => (
            <li key={p.slug}>
              <SpineCard index={i}>
                <WriteupCard post={p} />
              </SpineCard>
            </li>
          ))}
        </ul>
      </Spine>
    </div>
  );
}
