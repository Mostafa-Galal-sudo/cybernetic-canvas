import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { Spine, SpineCard } from "@/components/Spine";
import { Check, Sword, ShieldCheck, BrainCircuit, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Hire Mostafa Galal" },
      {
        name: "description",
        content:
          "Pentesting, red team labs, and security mentoring with Mostafa Galal — eJPT certified.",
      },
      { property: "og:title", content: "Services — Hire Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Pentesting, red team labs, and security mentoring with Mostafa Galal — eJPT certified.",
      },
    ],
  }),
  component: ServicesPage,
});

const TIERS = [
  {
    Icon: ShieldCheck,
    name: "Penetration Testing",
    tagline: "Time-boxed, scoped assessment of a defined web or network target.",
    bullets: [
      "Web app or external network scope",
      "eJPT-aligned methodology",
      "Engineer-friendly remediation report",
      "Free re-test of fixes within 30 days",
    ],
    cta: "Scope a pentest",
    highlight: false,
  },
  {
    Icon: Sword,
    name: "Red Team Lab Engagement",
    tagline: "Goal-oriented, multi-vector simulation in lab/staging environments.",
    bullets: [
      "Custom objectives & rules of engagement",
      "Recon, exploitation, post-exploitation chain",
      "Defender collaboration and detection notes",
      "Executive + technical debrief",
    ],
    cta: "Plan engagement",
    highlight: true,
  },
  {
    Icon: BrainCircuit,
    name: "Mentoring & CTF Coaching",
    tagline: "1:1 mentoring for students and engineers entering offensive security.",
    bullets: [
      "TryHackMe / HTB study plan",
      "eJPT exam preparation",
      "Bug bounty workflow review",
      "CTF debriefs and writeup feedback",
    ],
    cta: "Book mentoring",
    highlight: false,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const bulletVariants = {
  hidden: { opacity: 0, x: -14 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EASE, delay: i * 0.07 },
  }),
};

type Tier = (typeof TIERS)[number];

function ServiceCard({ tier }: { tier: Tier }) {
  // Bullets stagger in only after the swing completes (driven by SpineCard).
  const [bulletsReady, setBulletsReady] = useState(false);

  return (
    <TiltCard
      intensity={tier.highlight ? 5 : 8}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 glass-panel gradient-border corner-brackets",
        tier.highlight && "shadow-[0_0_60px_oklch(0.85_0.18_200/0.28)]",
      )}
    >
      {tier.highlight && (
        <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-background">
          most asked
        </div>
      )}

      {tier.highlight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.85 0.18 200 / 0.18), transparent 70%)",
          }}
        />
      )}

      <motion.div
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="grid h-12 w-12 place-items-center rounded-xl glass-panel gradient-border"
      >
        <tier.Icon className="h-5 w-5 text-cyber-cyan" />
      </motion.div>

      <h3 className="mt-5 font-display text-2xl font-semibold transition-colors duration-300 group-hover:text-cyber-cyan">
        {tier.name}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{tier.tagline}</p>

      <ul className="mt-6 space-y-2.5">
        {tier.bullets.map((b, i) => (
          <motion.li
            key={b}
            custom={i}
            variants={bulletVariants}
            initial="hidden"
            animate={bulletsReady ? "show" : "hidden"}
            className="flex items-start gap-2 text-sm text-foreground/85"
            // Trigger bullets when the card-level swing completes.
            // We listen for a custom event dispatched by parent.
            onAnimationStart={() => {
              if (!bulletsReady) setBulletsReady(true);
            }}
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyber-cyan" />
            {b}
          </motion.li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Link to="/contact">
          <motion.span
            whileHover={{
              boxShadow: "0 0 36px oklch(0.85 0.18 200 / 0.55)",
              scale: 1.02,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-5 py-3 font-mono text-xs uppercase tracking-wider text-background"
          >
            {tier.cta}
            <motion.span
              className="inline-flex"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </motion.span>
        </Link>
      </div>
    </TiltCard>
  );
}

function ServiceSpineSlot({ tier, index }: { tier: Tier; index: number }) {
  const [, setReady] = useState(false);
  return (
    <SpineCard index={index} onSwingComplete={() => setReady(true)}>
      <ServiceCard tier={tier} />
    </SpineCard>
  );
}

function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="engagements::open"
          title="Three ways to work together"
          description="From a focused pentest to mentoring — pick the shape that fits."
        />
      </Reveal>

      <Spine className="mt-16">
        <ul className="space-y-14">
          {TIERS.map((t, i) => (
            <li key={t.name}>
              <ServiceSpineSlot tier={t} index={i} />
            </li>
          ))}
        </ul>
      </Spine>

      <Reveal delay={0.2}>
        <motion.div
          whileHover={{ boxShadow: "0 0 50px oklch(0.65 0.25 290 / 0.2)" }}
          transition={{ duration: 0.35, ease: EASE }}
          className="group relative mt-16 overflow-hidden rounded-2xl p-8 text-center glass-panel gradient-border"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyber-violet/6 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
          />

          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
            not sure which fits?
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            Tell me about your system — I&apos;ll tell you what I&apos;d test first.
          </h3>

          <Link to="/contact">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px oklch(0.85 0.18 200 / 0.3)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border"
            >
              Start the conversation
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.span>
            </motion.span>
          </Link>
        </motion.div>
      </Reveal>
    </div>
  );
}
