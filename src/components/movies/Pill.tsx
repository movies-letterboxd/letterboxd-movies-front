import cls from "../../utils/cls";

export default function Pill({ children, title, className }: { children: React.ReactNode; title?: string; className?: string }) {
  return (
    <span title={title} className={cls("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", className)}>
      {children}
    </span>
  )
}