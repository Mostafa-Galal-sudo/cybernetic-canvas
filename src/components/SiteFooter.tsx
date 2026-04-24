import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Instagram, Facebook, Mail } from "lucide-react";

const SOCIALS = [
  { Icon: Github,    href: "https://github.com/Mostafa-Galal-sudo",                    label: "GitHub" },
  { Icon: Linkedin,  href: "https://www.linkedin.com/in/mostafa-galal-97148b216/",     label: "LinkedIn" },
  { Icon: Instagram, href: "https://www.instagram.com/mostafa__galal_11/",             label: "Instagram" },
  { Icon: Facebook,  href: "https://www.facebook.com/mostafa.galal.7545",              label: "Facebook" },
  { Icon: Mail,      href: "mailto:mosthistory139@gmail.com",                          label: "Email" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-glass-border/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-mono text-sm tracking-wider">
              <span className="text-cyber-cyan">~/</span>mostafa-galal
            </div>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Communications & Electronics Engineering student · eJPT-certified
              red teamer · TryHackMe top performer. Building, breaking, and
              documenting along the way.
            </p>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-cyber-cyan">
              Sitemap
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link to="/projects" className="text-muted-foreground hover:text-foreground">Projects</Link></li>
              <li><Link to="/writeups" className="text-muted-foreground hover:text-foreground">Writeups</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-foreground">Services</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-cyber-cyan">
              Connect
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  title={label}
                  className="grid h-10 w-10 place-items-center rounded-md text-muted-foreground transition-all hover:text-cyber-cyan hover:shadow-[0_0_24px_oklch(0.85_0.18_200/0.45)] glass-panel gradient-border"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="mt-3 font-mono text-[11px] text-muted-foreground">
              <a href="mailto:mosthistory139@gmail.com" className="hover:text-cyber-cyan">
                mosthistory139@gmail.com
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-glass-border/60 pt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Mostafa Galal. All systems nominal.</div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse-glow rounded-full bg-cyber-cyan" />
            status: online
          </div>
        </div>
      </div>
    </footer>
  );
}
