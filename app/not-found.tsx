import Link from "next/link";
import { Shield, ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-background">
      {/* Glitch-style 404 */}
      <div className="relative">
        <h1 className="text-[8rem] sm:text-[10rem] font-bold font-mono text-primary/20 select-none leading-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 backdrop-blur-sm">
            <Terminal className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-3 max-w-md -mt-4">
        <h2 className="text-2xl font-bold font-mono text-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          It might have been taken offline — or maybe it never existed in the
          first place.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          asChild
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button
          variant="outline"
          className="border-primary/30 hover:bg-primary/10 hover:text-primary"
          asChild
        >
          <Link href="/#contact">
            <Shield className="h-4 w-4" />
            Report Issue
          </Link>
        </Button>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
}
