import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="bg-gradient-to-b from-[#233B5D] to-[#121C2E] min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-white" size={48} />
    </div>
  )
}