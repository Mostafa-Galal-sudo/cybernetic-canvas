import { ChevronRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <div
        className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-gradient-to-r from-cyber-cyan to-transparent" />
        <ChevronRight className="h-3 w-3" />
        {eyebrow}
      </div>
      <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
        {title.split(" ").map((w, i) =>
          i % 3 === 1 ? (
            <span key={i} className="text-gradient-cyber">
              {w}{" "}
            </span>
          ) : (
            <span key={i}>{w} </span>
          ),
        )}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
