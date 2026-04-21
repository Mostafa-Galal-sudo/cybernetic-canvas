import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { SpineColumn, useSpineScrollProgress, useIsSmall } from "@/components/SpineColumn";
import { SpineCard } from "@/components/SpineCard";
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
    tags: ["bug bounty", "smtp", "email security", "reconnaissance"],
    title: "Snapchat SMTP Open Relay Vulnerability",
    excerpt:
      "During a bug bounty engagement I discovered an SMTP open relay on beta.snappublisher.snapchat.com allowing unauthenticated relay through Snapchat's infrastructure. Full PoC, recon chain, and responsible disclosure.",
  },
  {
    slug: "tryhackme-three-season-streak",
    date: "2025-09-01",
    tags: ["tryhackme", "red team", "offensive security", "achievements"],
    title: "TryHackMe Leaderboards: 1st Place Across Three Seasons",
    excerpt:
      "Bronze (5.2%), Gold (1.7%), Sapphire (0.8% Epic Tier) — three seasons, 1st place each. What the grind looked like and what it taught me.",
  },
  {
    slug: "journey-into-red-teaming",
    date: "2025-05-20",
    tags: ["red teaming", "learning", "ctf", "engineering"],
    title: "My Journey into Red Teaming",
    excerpt:
      "Balancing a Communications & Electronics Engineering degree with self-directed offensive security. The challenges, the CTF placements, and what consistent practice actually looks like.",
  },
  {
    slug: "chainbreaker-re",
    date: "2025-10-20",
    tags: ["reverse engineering", "ghidra", "ctf", "crackme"],
    title: "Chainbreaker (RE) — Iterative State Cracking",
    excerpt:
      "A C++ crackme that demands a seed which loops back to itself after N iterations of a custom transform. Ghidra renaming, equation analysis, and a Python brute-force solver.",
  },
  {
    slug: "crowdsecurity-auth",
    date: "2025-10-12",
    tags: ["reverse engineering", "radare2", "ghidra", "algebra"],
    title: "CrowdSecurity Auth — Algebraic Reversal",
    excerpt:
      "An ELF auth binary verifying a 13-character password via per-character math. Reversed the equation to compute the password directly without bruteforce.",
  },
  {
    slug: "jack-of-all-trades",
    date: "2025-09-22",
    tags: ["ctf", "tryhackme", "stego", "ssh", "suid"],
    title: "Jack-of-All-Trades — Ports, Stego, and SUID Strings",
    excerpt:
      "Swapped HTTP/SSH ports, base64 + ROT13 + base32 chains, steghide on the right image, hydra over SSH on port 80, and a SUID strings binary for the root flag.",
  },
  {
    slug: "cybertalents-practice-bash",
    date: "2025-10-17",
    tags: ["ctf", "cybertalents", "bash", "stego", "zip cracking"],
    title: "CyberTalents — Practice Bash Walkthrough",
    excerpt:
      "Nested zip archives, john/hashcat/fcrackzip detours, ELF strings revealing 'passforasciiii', and a chain of base64-decoded passwords down to the final flag.",
  },
  {
    slug: "mr-robot-ctf",
    date: "2025-08-14",
    tags: ["ctf", "tryhackme", "wordpress", "wpscan", "privesc"],
    title: "Mr Robot CTF — WordPress to Root via SUID nmap",
    excerpt:
      "Three keys across a Mr Robot themed box: WPScan brute-force on Elliot, PHP reverse shell via theme editor, MD5 crack for user 'robot', then SUID nmap → root.",
  },
  {
    slug: "tryhackme-tomcat-ghostcat",
    date: "2025-08-29",
    tags: ["ctf", "tryhackme", "ghostcat", "cve-2020-1938", "gpg"],
    title: "TryHackMe Tomcat — Ghostcat (CVE-2020-1938)",
    excerpt:
      "AJP file read on port 8009 leaks SSH creds from web.xml. PGP-decrypt user creds with a cracked passphrase, then escalate via sudo zip / cron ufw.sh.",
  },
  {
    slug: "0xl0ccedc0de-revenge",
    date: "2025-11-02",
    tags: ["binary exploitation", "format string", "rop", "ret2func", "ctf"],
    title: "0xL0CCEDC0DE'S REVENGE — Multi-Stage Pwn",
    excerpt:
      "Format-string %hhn flip, integer boundary trap, heap overflow into a strdup'd password, then a 18-byte gets() overflow chained with ret2func across solver0 → solver1.",
  },
  {
    slug: "ascii-crackme",
    date: "2025-09-30",
    tags: ["reverse engineering", "ghidra", "crackme", "ctf"],
    title: "ascii — Position-Shift Crackme",
    excerpt:
      "A crackme where each input character is shifted by (6 - i) before comparison against a hidden encoded_flag in .bss. Reversed the per-index shift to recover the flag.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const tagVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

type Post = (typeof POSTS)[number];

function WriteupCard({ post, ready }: { post: Post; ready: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 0 50px oklch(0.85 0.18 200 / 0.4)" }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <TiltCard intensity={6} className="group h-full rounded-2xl">
        <Link
          to="/writeups/$slug"
          params={{ slug: post.slug }}
          className="relative flex h-full flex-col overflow-hidden rounded-2xl p-6 glass-panel gradient-border corner-brackets"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyber-cyan/8 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />

          <motion.div
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
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
    </motion.div>
  );
}

function WriteupSlot({ post, index }: { post: Post; index: number }) {
  const [ready, setReady] = useState(false);
  return (
    <SpineCard index={index} onSettled={() => setReady(true)}>
      <WriteupCard post={post} ready={ready} />
    </SpineCard>
  );
}

function WriteupsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useSpineScrollProgress(containerRef);
  const isSmall = useIsSmall();

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "200vh" }}>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="notes::field"
            title="Writeups, research, and reflections"
            description="Long-form notes from bug bounty work, competitions, and the learning process itself."
          />
        </Reveal>
      </div>

      {!isSmall && (
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 hidden h-screen w-full sm:block"
          style={{ zIndex: 0 }}
        >
          <SpineColumn progressRef={progress} />
        </div>
      )}

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6"
        style={{
          marginTop: isSmall ? 0 : "-100vh",
          zIndex: 10,
        }}
      >
        <ul className="space-y-20 pb-32 pt-8 sm:space-y-28">
          {POSTS.map((p, i) => (
            <li key={p.slug}>
              <WriteupSlot post={p} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
