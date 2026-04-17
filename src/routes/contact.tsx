import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Github, Linkedin, Twitter, Mail, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — [Your Name]" },
      {
        name: "description",
        content:
          "Get in touch with [Your Name] for security engagements, consulting, and collaborations.",
      },
      { property: "og:title", content: "Contact — [Your Name]" },
      {
        property: "og:description",
        content:
          "Get in touch with [Your Name] for security engagements, consulting, and collaborations.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Transmission received — I'll respond within 48h.");
      (e.target as HTMLFormElement).reset();
    }, 900);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="comms::open"
          title="Open a secure channel"
          description="Engagements, collaborations, or just a hello — I read everything."
        />
      </Reveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <form
            onSubmit={onSubmit}
            className="relative overflow-hidden rounded-3xl p-8 glass-panel gradient-border corner-brackets"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
              transmit::form
            </div>

            <div className="mt-6 space-y-5">
              <FloatField id="name" label="Your name" type="text" required />
              <FloatField id="email" label="Your email" type="email" required />
              <FloatField id="subject" label="Subject" type="text" />
              <FloatField id="message" label="Message" textarea required />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-6 py-3 font-mono text-xs uppercase tracking-wider text-background transition-shadow hover:shadow-[0_0_36px_oklch(0.85_0.18_200/0.55)] disabled:opacity-60"
            >
              {sending ? "Encrypting..." : "Send transmission"}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="rounded-2xl p-6 glass-panel gradient-border">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                channels
              </div>
              <ul className="mt-4 space-y-3">
                <a
                  href="mailto:hello@example.com"
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-md text-cyber-cyan glass-panel gradient-border transition-shadow group-hover:shadow-[0_0_20px_oklch(0.85_0.18_200/0.5)]">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span>
                    <div className="font-mono text-xs text-muted-foreground">email</div>
                    <div className="text-sm font-medium">[hello@yourname.dev]</div>
                  </span>
                </a>
                {[
                  { Icon: Github, label: "github", value: "[github.com/yourhandle]" },
                  { Icon: Linkedin, label: "linkedin", value: "[linkedin.com/in/you]" },
                  { Icon: Twitter, label: "x", value: "[@yourhandle]" },
                ].map(({ Icon, label, value }) => (
                  <a
                    key={label}
                    href="#"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-md text-cyber-cyan glass-panel gradient-border transition-shadow group-hover:shadow-[0_0_20px_oklch(0.85_0.18_200/0.5)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <div className="font-mono text-xs text-muted-foreground">{label}</div>
                      <div className="text-sm font-medium">{value}</div>
                    </span>
                  </a>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 glass-panel gradient-border">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                pgp
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                For sensitive disclosures, encrypt with my key:
              </p>
              <pre className="mt-3 overflow-x-auto rounded-md bg-background/50 p-3 font-mono text-[11px] text-cyber-cyan">
                FPR: [XXXX YYYY ZZZZ AAAA BBBB]
              </pre>
            </div>
          </div>
        </Reveal>
      </div>

      <Toaster />
    </div>
  );
}

function FloatField({
  id,
  label,
  type = "text",
  textarea,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const Common =
    "peer w-full rounded-lg border border-border bg-background/40 px-4 pt-5 pb-2 text-sm text-foreground outline-none transition-all placeholder-transparent focus:border-cyber-cyan focus:shadow-[0_0_24px_oklch(0.85_0.18_200/0.25)]";
  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          name={id}
          required={required}
          rows={5}
          placeholder={label}
          className={Common}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          placeholder={label}
          className={Common}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-1.5 font-mono text-[10px] uppercase tracking-wider text-cyber-cyan transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted-foreground peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-cyber-cyan"
      >
        {label}
      </label>
    </div>
  );
}
