import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { AlertTriangle, Calendar, FileWarning, Hash } from "lucide-react";

export const Route = createFileRoute("/writeups")({
  head: () => ({
    meta: [
      { title: "Writeups — Mostafa Galal" },
      {
        name: "description",
        content:
          "Threat intel briefings — bug bounty findings, CTF walkthroughs, and reverse engineering writeups by Mostafa Galal.",
      },
      { property: "og:title", content: "Writeups — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Threat intel briefings — bug bounty findings, CTF walkthroughs, and reverse engineering writeups.",
      },
    ],
  }),
  component: WriteupsPage,
});

type Severity = "critical" | "high" | "medium" | "info";

const POSTS: {
  slug: string;
  date: string;
  tags: string[];
  title: string;
  excerpt: string;
  severity: Severity;
  cvss: string;
  classification: string;
  trkId: string;
}[] = [
  {
    slug: "snapchat-smtp-open-relay",
    date: "2025-05-15",
    tags: ["bug bounty", "smtp", "email security"],
    title: "Snapchat SMTP Open Relay Vulnerability",
    excerpt:
      "Unauthenticated SMTP relay on beta.snappublisher.snapchat.com — full PoC (telnet + swaks), recon chain, and responsible disclosure timeline.",
    severity: "high",
    cvss: "8.1",
    classification: "BUG-BOUNTY",
    trkId: "TIB-2025-001",
  },
  {
    slug: "0xl0ccedc0de-revenge",
    date: "2025-11-02",
    tags: ["binary exploitation", "format string", "rop", "ret2func"],
    title: "0xL0CCEDC0DE'S REVENGE — Multi-Stage Pwn",
    excerpt:
      "Format-string %hhn flip, integer boundary trap, heap overflow into a strdup'd password, and an 18-byte gets() overflow chained with ret2func solver0 → solver1.",
    severity: "critical",
    cvss: "9.8",
    classification: "CTF / PWN",
    trkId: "TIB-2025-002",
  },
  {
    slug: "tryhackme-tomcat-ghostcat",
    date: "2025-08-29",
    tags: ["ghostcat", "cve-2020-1938", "tomcat", "gpg"],
    title: "TryHackMe Tomcat — Ghostcat (CVE-2020-1938)",
    excerpt:
      "AJP file read on port 8009 leaks SSH creds from web.xml. PGP-decrypt user creds with a cracked passphrase, then escalate via sudo zip / cron ufw.sh.",
    severity: "critical",
    cvss: "9.1",
    classification: "CTF / WEB",
    trkId: "TIB-2025-003",
  },
  {
    slug: "mr-robot-ctf",
    date: "2025-08-14",
    tags: ["wordpress", "wpscan", "privesc", "suid"],
    title: "Mr Robot CTF — WordPress to Root via SUID nmap",
    excerpt:
      "Three keys across a Mr Robot themed box: WPScan brute-force on Elliot, PHP reverse shell via theme editor, MD5 crack for user 'robot', then SUID nmap → root.",
    severity: "high",
    cvss: "8.6",
    classification: "CTF / WEB",
    trkId: "TIB-2025-004",
  },
  {
    slug: "jack-of-all-trades",
    date: "2025-09-22",
    tags: ["stego", "ssh", "suid", "tryhackme"],
    title: "Jack-of-All-Trades — Ports, Stego, and SUID Strings",
    excerpt:
      "Swapped HTTP/SSH ports, base64 + ROT13 + base32 chains, steghide on the right image, hydra over SSH on port 80, and a SUID strings binary for the root flag.",
    severity: "high",
    cvss: "7.8",
    classification: "CTF / MULTI",
    trkId: "TIB-2025-005",
  },
  {
    slug: "chainbreaker-re",
    date: "2025-10-20",
    tags: ["reverse engineering", "ghidra", "crackme"],
    title: "Chainbreaker (RE) — Iterative State Cracking",
    excerpt:
      "A C++ crackme that demands a seed which loops back to itself after N iterations of a custom transform. Ghidra renaming, equation analysis, and a Python brute-force solver.",
    severity: "medium",
    cvss: "6.4",
    classification: "REVERSE ENG",
    trkId: "TIB-2025-006",
  },
  {
    slug: "crowdsecurity-auth",
    date: "2025-10-12",
    tags: ["reverse engineering", "radare2", "ghidra", "algebra"],
    title: "CrowdSecurity Auth — Algebraic Reversal",
    excerpt:
      "An ELF auth binary verifying a 13-character password via per-character math. Reversed the equation to compute the password directly without bruteforce.",
    severity: "medium",
    cvss: "6.1",
    classification: "REVERSE ENG",
    trkId: "TIB-2025-007",
  },
  {
    slug: "ascii-crackme",
    date: "2025-09-30",
    tags: ["reverse engineering", "ghidra", "crackme"],
    title: "ascii — Position-Shift Crackme",
    excerpt:
      "Each input character shifted by (6 - i) before comparison against a hidden encoded_flag in .bss. Reversed the per-index shift to recover the flag.",
    severity: "medium",
    cvss: "5.9",
    classification: "REVERSE ENG",
    trkId: "TIB-2025-008",
  },
  {
    slug: "cybertalents-practice-bash",
    date: "2025-10-17",
    tags: ["bash", "stego", "zip cracking", "cybertalents"],
    title: "CyberTalents — Practice Bash Walkthrough",
    excerpt:
      "Nested zip archives, john / hashcat / fcrackzip detours, ELF strings revealing 'passforasciiii', and a chain of base64-decoded passwords down to the final flag.",
    severity: "info",
    cvss: "4.7",
    classification: "CTF / MISC",
    trkId: "TIB-2025-009",
  },
  {
    slug: "tryhackme-three-season-streak",
    date: "2025-09-01",
    tags: ["tryhackme", "red team", "achievements"],
    title: "TryHackMe Leaderboards: 1st Place Across Three Seasons",
    excerpt:
      "Bronze (5.2%), Gold (1.7%), Sapphire (0.8% Epic Tier) — three seasons, 1st place each. What the grind looked like and what it taught me.",
    severity: "info",
    cvss: "—",
    classification: "JOURNAL",
    trkId: "TIB-2025-010",
  },
  {
    slug: "journey-into-red-teaming",
    date: "2025-05-20",
    tags: ["red teaming", "learning", "ctf"],
    title: "My Journey into Red Teaming",
    excerpt:
      "Balancing a Communications & Electronics Engineering degree with self-directed offensive security. Challenges, CTF placements, and what consistent practice looks like.",
    severity: "info",
    cvss: "—",
    classification: "JOURNAL",
    trkId: "TIB-2025-011",
  },
];

const SEV_STYLE: Record<Severity, { bg: string; text: string; ring: string; label: string }> = {
  critical: { bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/40", label: "CRITICAL" },
  high:     { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/40", label: "HIGH" },
  medium:   { bg: "bg-cyber-cyan/10", text: "text-cyber-cyan", ring: "ring-cyber-cyan/40", label: "MEDIUM" },
  info:     { bg: "bg-cyber-violet/10", text: "text-cyber-violet", ring: "ring-cyber-violet/40", label: "INFO" },
};

const EASE = [0.22, 1, 0.36, 1] as const;

function BriefingCard({ post, idx }: { post: (typeof POSTS)[number]; idx: number }) {
  const sev = SEV_STYLE[post.severity];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: EASE, delay: (idx % 4) * 0.05 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px oklch(0 0 0 / 0.4), 0 0 30px oklch(0.85 0.18 200 / 0.25)" }}
    >
      <a
        href={`/writeups/${post.slug}`}
        className="group relative block overflow-hidden rounded-xl glass-panel gradient-border"
      >
        {/* header strip — like a classified document */}
        <div
          className={`flex items-center justify-between px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] ${sev.bg} ${sev.text} border-b border-white/5`}
        >
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" />
            {sev.label}
          </span>
          <span className="opacity-70">{post.trkId}</span>
        </div>

        {/* CVSS banner */}
        <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Hash className={`h-3 w-3 ${sev.text}`} />
            CVSS <span className={`tabular-nums ${sev.text}`}>{post.cvss}</span>
          </span>
          <span className="opacity-70">{post.classification}</span>
        </div>

        {/* body */}
        <div className="p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {post.date}
          </div>

          <h3 className="mt-3 font-display text-lg font-semibold leading-snug transition-colors duration-300 group-hover:text-cyber-cyan">
            {post.title}
          </h3>

          {/* redacted accent line */}
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-12 rounded-sm bg-foreground/30" />
            <span className="h-2 w-6 rounded-sm bg-foreground/20" />
            <span className="h-2 w-16 rounded-sm bg-foreground/15" />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
            {post.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ring-1 ${sev.ring} ${sev.text}`}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyber-cyan">
            <FileWarning className="h-3 w-3" /> open full briefing →
          </div>
        </div>

        {/* corner stamp */}
        <div
          aria-hidden
          className={`pointer-events-none absolute right-3 top-14 rotate-12 rounded-sm border-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] opacity-30 ${sev.text}`}
          style={{ borderColor: "currentColor" }}
        >
          confidential
        </div>
      </a>
    </motion.div>
  );
}

function WriteupsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-cyber-cyan to-transparent" />
            threat::intel
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Threat intelligence <span className="text-gradient-cyber">briefings</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Each writeup filed as an intel briefing — severity, CVSS estimate, classification, and a tracking ID.
            Click any card for the full report.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p, i) => (
          <BriefingCard key={p.slug} post={p} idx={i} />
        ))}
      </div>
    </div>
  );
}
