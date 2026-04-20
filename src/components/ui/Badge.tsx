interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "indigo" | "green" | "amber" | "red";
  size?: "sm" | "md";
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
