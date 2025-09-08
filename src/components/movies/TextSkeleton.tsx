import cls from "../../utils/cls";

export default function TextSkeleton({ w = "w-2/3" }: { w?: string }) {
  return <div className={cls("h-3 rounded bg-white/10", w)} />
}