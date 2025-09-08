import cls from "../../utils/cls";
import Pill from "./Pill";

export default function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Pill className={cls(active ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20" : "bg-rose-500/15 text-rose-300 border border-rose-400/20")}
    >
      {active ? "Activa" : "Inactiva"}
    </Pill>
  )
}