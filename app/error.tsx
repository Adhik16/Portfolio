"use client";

import { useEffect } from "react";
import { ShieldAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-background">
      {/* Icon */}
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <div className="absolute inset-0 rounded-full bg-destructive/10 blur-xl animate-pulse" />
      </div>

      {/* Message */}
      <div className="text-center space-y-3 max-w-md">
        <h1 className="text-2xl font-bold font-mono text-foreground">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          An unexpected error occurred. This has been logged and will be
          investigated. Try refreshing the page or come back later.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Error ID: <code className="text-primary">{error.digest}</code>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={reset}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          className="border-primary/30 hover:bg-primary/10 hover:text-primary"
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </Button>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-destructive/5 to-transparent pointer-events-none" />
    </div>
  );
}
