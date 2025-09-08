import Pill from "./Pill";

export default function GenreBadge({ label }: { label: string }) {
  return <Pill className="bg-white/10 text-white border border-white/15 backdrop-blur-sm">{label}</Pill>
}