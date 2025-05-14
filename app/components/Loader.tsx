import { Loader2 } from "lucide-react";

export default function LoaderScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#1f0135] to-[#0b0c20] backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        <p className="text-lg font-semibold text-white">Loading your vault...</p>
      </div>
    </div>
  );
}
