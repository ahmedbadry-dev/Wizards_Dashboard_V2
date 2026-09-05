import { cn } from "../../lib/cn";

type BadgeTone = "success" | "warning" | "danger" | "neutral";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  tone?: BadgeTone;
};

const toneClassNames: Record<BadgeTone, string> = {
  success: "border-accent/30 bg-accent/10 text-accent",
  warning: "border-accent/30 bg-accent/10 text-accent",
  danger: "border-danger/30 bg-danger/10 text-danger",
  neutral: "border-body-muted/30 bg-body-muted/10 text-body-muted",
};

export function Badge({ children, tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
        toneClassNames[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
