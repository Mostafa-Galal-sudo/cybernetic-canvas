import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { HelixSpine, useScrollProgress, useIsMobile } from "@/components/HelixSpine";
import { HelixCard } from "@/components/HelixCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Github } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Mostafa Galal" },
      {
        name: "description",
        content:
          "Hands-on projects by Mostafa Galal — security tooling, payload research, embedded systems, and analog electronics.",
      },
      { property: "og:title", content: "Projects — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Hands-on projects by Mostafa Galal — security tooling, payload research, embedded systems, and analog electronics.",
      },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  id: string;
  code: string;
  status: "shipped" | "active" | "archived";
  category: "security" | "technical";
  title: string;
  tagline: string;
  description: string;
  takeaways: string;
  tech: string[];
  github?: string;
  demo?: string;
  gradient: string;
};

const PROJECTS: Project[] = [
  {
    id: "p01",
    code: "PROJ_01",
    status: "shipped",
    category: "security",
    title: "Shadow Core Framework",
    tagline: "Modular core framework for staged payload delivery and listener orchestration.",
    description:
      "Shadow Core is a custom-built framework designed to manage configuration, staged delivery, and controlled execution flows. It serves as the backbone for multiple experimental security modules.",
    takeaways:
      "Designed a modular infrastructure framework demonstrating strong understanding of staged execution and configuration-driven behavior.",
    tech: ["Python", "Bash", "JSON", "Linux", "Deployment Scripts"],
    gradient:
      "linear-gradient(135deg, oklch(0.85 0.18 200 / 0.4), oklch(0.65 0.25 290 / 0.4))",
  },
  {
    id: "p02",
    code: "PROJ_02",
    status: "shipped",
    category: "security",
    title: "Payload Research Toolkit",
    tagline: "Multi-platform payload research toolkit for delivery & obfuscation studies.",
    description:
      "Researches how different payload formats behave across operating systems. Includes payload generation, lightweight obfuscation, delivery simulation, and listener-side handling for controlled lab environments.",
    takeaways:
      "Gained deep insight into payload lifecycle analysis, cross-platform behavior, and delivery-chain modeling.",
    tech: ["Python", "JavaScript", "Bash", "Linux", "Obfuscation"],
    gradient:
      "linear-gradient(135deg, oklch(0.7 0.27 330 / 0.4), oklch(0.85 0.18 200 / 0.4))",
  },
  {
    id: "p03",
    code: "PROJ_03",
    status: "shipped",
    category: "security",
    title: "NM Analyzer",
    tagline: "Static analysis tool for Linux Kernel Modules using symbol-table heuristics.",
    description:
      "NM Analyzer automates the inspection of ELF binaries by parsing symbol tables. It uses semantic heuristics to categorize symbols into risk groups such as Syscall Hooking and Privilege Escalation.",
    takeaways:
      "Built a security-focused binary analysis tool; implemented heuristic-based detection for kernel-level threats; mastered ELF symbol-table analysis.",
    tech: ["Python", "ELF Analysis", "Linux Kernel", "Heuristics"],
    demo: "assets/nm.mp4",
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.25 290 / 0.4), oklch(0.7 0.27 330 / 0.4))",
  },
  {
    id: "p04",
    code: "PROJ_04",
    status: "shipped",
    category: "security",
    title: "Endpoint Telemetry Logger",
    tagline: "Client-server telemetry tool for capturing input patterns in lab environments.",
    description:
      "Explores endpoint-level telemetry collection by hiding inside a game (any game) and transmitting structured logs to a central server for analysis.",
    takeaways:
      "Developed a client-server telemetry system, demonstrating understanding of endpoint monitoring and data transport.",
    tech: ["Python", "Sockets", "File I/O", "Client-Server"],
    gradient:
      "linear-gradient(135deg, oklch(0.75 0.18 160 / 0.4), oklch(0.85 0.18 200 / 0.4))",
  },
  {
    id: "p05",
    code: "PROJ_05",
    status: "shipped",
    category: "security",
    title: "FaceBlur Live",
    tagline: "Real-time computer vision app that detects and blurs faces in live video.",
    description:
      "FaceBlur Live is a real-time video processing application that detects human faces from a live camera feed and applies dynamic blurring to protect identity.",
    takeaways:
      "Built a real-time computer vision system, showcasing strong understanding of video streams and detection pipelines.",
    tech: ["Python", "OpenCV", "Computer Vision", "Real-Time"],
    demo: "assets/livefaceblur.mp4",
    gradient:
      "linear-gradient(135deg, oklch(0.78 0.18 80 / 0.4), oklch(0.7 0.27 330 / 0.4))",
  },
  {
    id: "p06",
    code: "PROJ_06",
    status: "shipped",
    category: "security",
    title: "TCP Full Scan Tool",
    tagline: "Custom TCP-based network scanner for analyzing services and port states.",
    description:
      "Implements a TCP full-connect scanning approach to enumerate open, closed, and filtered ports. Emphasizes low-level networking concepts.",
    takeaways:
      "Demonstrated strong networking fundamentals by implementing a custom TCP scanning engine.",
    tech: ["Python", "TCP Sockets", "Networking"],
    demo: "assets/tcp_full_scan.mp4",
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.25 290 / 0.4), oklch(0.75 0.18 160 / 0.4))",
  },
  {
    id: "p07",
    code: "PROJ_07",
    status: "shipped",
    category: "technical",
    title: "Smart Recon Vehicle",
    tagline: "Embedded systems vehicle combining automation and remote control.",
    description:
      "An embedded systems project focused on building a remotely controlled and semi-autonomous vehicle. Integrates a motor driver with multiple motors, Bluetooth-based remote control via HC-05, and laptop-side monitoring.",
    takeaways:
      "Designed and implemented a modular embedded control system; gained hands-on experience with motor drivers, Bluetooth communication, and automation logic.",
    tech: ["Embedded C/C++", "Motor Driver", "HC-05", "Serial Comm"],
    github:
      "https://github.com/youssefsalama-11/Smart-Car-Project/blob/main/Smart_Car.ino",
    gradient:
      "linear-gradient(135deg, oklch(0.85 0.18 200 / 0.4), oklch(0.78 0.18 80 / 0.4))",
  },
  {
    id: "p08",
    code: "PROJ_08",
    status: "shipped",
    category: "technical",
    title: "3rd Order Butterworth Band-Pass Filter",
    tagline: "Passive 3rd-order Butterworth BPF with flat passband and precise selection.",
    description:
      "Design and implementation of a passive 3rd-order Butterworth band-pass filter using only RLC components. Maximally flat magnitude response within the passband; targets a 1 MHz center frequency with a 10 kHz bandwidth.",
    takeaways:
      "Mastered Butterworth characteristics, filter order trade-offs, passive RLC design, and transfer-function analysis.",
    tech: ["Analog Filters", "Butterworth", "RLC", "Simulation"],
    demo: "assets/filter3rd.mp4",
    gradient:
      "linear-gradient(135deg, oklch(0.75 0.18 160 / 0.4), oklch(0.65 0.25 290 / 0.4))",
  },
  {
    id: "p09",
    code: "PROJ_09",
    status: "shipped",
    category: "technical",
    title: "Series RLC Band-Pass Filter",
    tagline: "Passive band-pass filter using a series RLC circuit for frequency selection.",
    description:
      "Analog electronics project demonstrating frequency selection using passive components. Allows signals around a defined center frequency to pass while attenuating low and high frequencies.",
    takeaways:
      "Strong understanding of resonance, center frequency, bandwidth, and quality factor; hands-on RLC circuits and frequency-domain analysis.",
    tech: ["RLC Circuits", "Analog", "Filters", "Frequency Response"],
    demo: "assets/bandpass.mp4",
    gradient:
      "linear-gradient(135deg, oklch(0.7 0.27 330 / 0.4), oklch(0.78 0.18 80 / 0.4))",
  },
  {
    id: "p10",
    code: "PROJ_10",
    status: "shipped",
    category: "technical",
    title: "Smart Curtain System",
    tagline: "Logic-gate-based smart curtain control for automated open/close.",
    description:
      "A digital logic project that controls curtain movement based on logical conditions such as light availability or user input. Pure logic-gate design — no microcontrollers — showcasing the fundamentals behind smart-home automation.",
    takeaways:
      "Applied digital logic to automation; improved skills in designing decision-making systems at the hardware level.",
    tech: ["Logic Gates", "Digital Logic", "Automation"],
    gradient:
      "linear-gradient(135deg, oklch(0.85 0.18 200 / 0.4), oklch(0.7 0.27 330 / 0.4))",
  },
  {
    id: "p11",
    code: "PROJ_11",
    status: "shipped",
    category: "technical",
    title: "TikTok Media Downloader",
    tagline: "Lightweight tool for downloading TikTok videos without watermarks or ads.",
    description:
      "A clean and minimal media downloader that retrieves TikTok videos without embedded watermarks or advertisements.",
    takeaways:
      "Built a clean media extraction tool, demonstrating proficiency in HTTP workflows and content parsing.",
    tech: ["Python", "HTTP Requests", "Media Parsing"],
    demo: "assets/tiktok.mp4",
    gradient:
      "linear-gradient(135deg, oklch(0.78 0.18 80 / 0.4), oklch(0.85 0.18 200 / 0.4))",
  },
];

const STATUS_COLOR: Record<Project["status"], string> = {
  active: "bg-cyber-cyan",
  shipped: "bg-emerald-400",
  archived: "bg-muted-foreground",
};

const EASE = [0.22, 1, 0.36, 1] as const;

const tagVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

function ProjectCard({
  project,
  onOpen,
  swung,
}: {
  project: Project;
  onOpen: () => void;
  swung: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: EASE }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <TiltCard className="group h-full">
        <button
          onClick={onOpen}
          className="relative block h-full w-full overflow-hidden rounded-2xl text-left glass-panel gradient-border corner-brackets transition-shadow hover:shadow-[0_0_40px_oklch(0.85_0.18_200/0.4)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyber-cyan/8 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full z-10"
          />
          <div
            aria-hidden
            className="aspect-[16/10] w-full"
            style={{ background: project.gradient }}
          >
            <div className="grid h-full place-items-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/70">
                {project.code}
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>{project.category}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-2 w-2 animate-pulse-glow rounded-full ${STATUS_COLOR[project.status]}`}
                />
                {project.status}
              </span>
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {project.tagline}
            </p>
            <motion.div
              initial="hidden"
              animate={swung ? "show" : "hidden"}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
              }}
              className="mt-4 flex flex-wrap gap-1.5"
            >
              {project.tech.slice(0, 3).map((t) => (
                <motion.span
                  key={t}
                  variants={tagVariants}
                  className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {t}
                </motion.span>
              ))}
              {project.tech.length > 3 && (
                <motion.span
                  variants={tagVariants}
                  className="font-mono text-[10px] text-muted-foreground"
                >
                  +{project.tech.length - 3}
                </motion.span>
              )}
            </motion.div>
          </div>
        </button>
      </TiltCard>
    </motion.div>
  );
}

function ProjectSlot({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const [swung, setSwung] = useState(false);
  return (
    <HelixCard index={index} offset={320} onSwingComplete={() => setSwung(true)}>
      <ProjectCard project={project} onOpen={onOpen} swung={swung} />
    </HelixCard>
  );
}

function ProjectsPage() {
  const [open, setOpen] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "security" | "technical">("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);
  const isMobile = useIsMobile();

  const filtered = PROJECTS.filter((p) => filter === "all" || p.category === filter);

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "400vh" }}>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="repo::index"
            title="11 projects across security & engineering"
            description="From red team tooling to analog filters — click any card for the full breakdown."
          />
        </Reveal>

        <div className="relative z-20 mt-10 flex flex-wrap gap-2">
          {(["all", "security", "technical"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all glass-panel gradient-border ${
                filter === k
                  ? "text-cyber-cyan shadow-[0_0_24px_oklch(0.85_0.18_200/0.35)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {!isMobile && (
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 h-screen w-full"
          style={{ zIndex: 0 }}
        >
          <HelixSpine scrollProgress={progress} />
        </div>
      )}

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6"
        style={{
          marginTop: isMobile ? 0 : "-100vh",
          zIndex: 10,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.ul
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="space-y-20 pb-32 pt-8"
          >
            {filtered.map((p, i) => (
              <li key={p.id}>
                <ProjectSlot project={p} index={i} onOpen={() => setOpen(p)} />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl glass-panel gradient-border">
          {open && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-cyber-cyan">
                  <span>
                    {open.code} · {open.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-2 w-2 animate-pulse-glow rounded-full ${STATUS_COLOR[open.status]}`}
                    />
                    {open.status}
                  </span>
                </div>
                <DialogTitle className="mt-2 font-display text-3xl">
                  {open.title}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {open.tagline}
                </DialogDescription>
              </DialogHeader>
              <div
                aria-hidden
                className="mt-2 aspect-[16/9] w-full overflow-hidden rounded-xl"
                style={{ background: open.gradient }}
              >
                <div className="grid h-full place-items-center">
                  <span className="font-mono text-xs uppercase tracking-[0.4em] text-foreground/70">
                    {open.code}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {open.description}
              </p>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                  key takeaways
                </div>
                <p className="mt-2 text-sm text-foreground/80">{open.takeaways}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {open.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {(open.github || open.demo) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {open.demo && (
                    <a
                      href={open.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Demo
                    </a>
                  )}
                  {open.github && (
                    <a
                      href={open.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground glass-panel gradient-border"
                    >
                      <Github className="h-3.5 w-3.5" /> Source
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
