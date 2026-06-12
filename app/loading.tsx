export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
      {/* Spinner */}
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />
      </div>

      {/* Loading text */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-mono text-muted-foreground animate-pulse">
          Loading<span className="animate-[pulse_1.5s_ease-in-out_infinite]">.</span>
          <span className="animate-[pulse_1.5s_ease-in-out_0.3s_infinite]">.</span>
          <span className="animate-[pulse_1.5s_ease-in-out_0.6s_infinite]">.</span>
        </p>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
}
