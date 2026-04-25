import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Github, Linkedin, Mail, Send, Instagram, Facebook, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mostafa Galal" },
      {
        name: "description",
        content:
          "Get in touch with Mostafa Galal for security engagements, mentoring, and collaborations.",
      },
      { property: "og:title", content: "Contact — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Get in touch with Mostafa Galal for security engagements, mentoring, and collaborations.",
      },
    ],
  }),
  component: ContactPage,
});

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzdldjb";

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sent) return;

    setSending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setSent(true);
        toast.success("Transmission received — I'll respond within 48h.");
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Transmission failed. Try again later.");
      }
    } catch {
      toast.error("Network error. Check your connection and retry.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="comms::open"
          title="Open a secure channel"
          description="Engagements, mentoring, collaborations — I read everything."
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
              <FloatField id="name" label="Your name" type="text" name="name" required />
              <FloatField id="email" label="Your email" type="email" name="email" required />
              <FloatField id="subject" label="Subject" type="text" name="subject" />
              <FloatField id="message" label="Message" textarea name="message" required />
            </div>

            <button
              type="submit"
              disabled={sending || sent}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-6 py-3 font-mono text-xs uppercase tracking-wider text-background transition-shadow hover:shadow-[0_0_36px_oklch(0.85_0.18_200/0.55)] disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Encrypting...
                </>
              ) : sent ? (
                <>Sent ✓</>
              ) : (
                <>
                  Send transmission
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>

            {sent && (
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                ✓ Message delivered — check your inbox for confirmation.
              </p>
            )}
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="rounded-2xl p-6 glass-panel gradient-border">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                channels
              </div>
              <ul className="mt-4 space-y-3">
                {[
                  {
                    Icon: Mail,
                    label: "email",
                    value: "mosthistory139@gmail.com",
                    href: "mailto:mosthistory139@gmail.com",
                  },
                  {
                    Icon: Github,
                    label: "github",
                    value: "Mostafa-Galal-sudo",
                    href: "https://github.com/Mostafa-Galal-sudo",
                  },
                  {
                    Icon: Linkedin,
                    label: "linkedin",
                    value: "mostafa-galal-97148b216",
                    href: "https://www.linkedin.com/in/mostafa-galal-97148b216/",
                  },
                  {
                    Icon: Instagram,
                    label: "instagram",
                    value: "mostafa__galal_11",
                    href: "https://www.instagram.com/mostafa__galal_11/",
                  },
                  {
                    Icon: Facebook,
                    label: "facebook",
                    value: "mostafa.galal.7545",
                    href: "https://www.facebook.com/mostafa.galal.7545",
                  },
                ].map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-md text-cyber-cyan glass-panel gradient-border transition-shadow group-hover:shadow-[0_0_20px_oklch(0.85_0.18_200/0.5)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <div className="font-mono text-xs text-muted-foreground">
                        {label}
                      </div>
                      <div className="text-sm font-medium">{value}</div>
                    </span>
                  </a>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 glass-panel gradient-border">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                credentials
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                eJPT certified · ITI Cybersecurity (90h) · Red Hat SA-I ·
                Communications & Electronics Engineering student.
              </p>
              <a
                href="https://certs.ine.com/bdf79a3b-3819-422f-b284-44dec448edb1#acc.dEjlnfeV"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan"
              >
                verify eJPT →
              </a>
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
  name,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  name: string;
}) {
  const Common =
    "peer w-full rounded-lg border border-border bg-background/40 px-4 pt-5 pb-2 text-sm text-foreground outline-none transition-all placeholder-transparent focus:border-cyber-cyan focus:shadow-[0_0_24px_oklch(0.85_0.18_200/0.25)]";
  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={5}
          placeholder={label}
          className={Common}
        />
      ) : (
        <input
          id={id}
          name={name}
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
