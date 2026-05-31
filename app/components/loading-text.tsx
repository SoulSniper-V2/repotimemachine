'use client';

export default function LoadingText() {
  return (
    <div className="flex items-center gap-2 text-[#666] text-sm">
      <div className="w-2 h-2 bg-[#ff6b00] rounded-full animate-pulse" />
      Generating documentary...
    </div>
  );
}
