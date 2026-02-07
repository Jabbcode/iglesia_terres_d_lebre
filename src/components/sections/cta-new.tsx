import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaNew() {
  return (
    <section id="nuevos" className="py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Button
          asChild
          className="h-14 rounded-full bg-amber px-10 text-sm font-bold tracking-wider text-white shadow-lg shadow-amber/25 hover:bg-amber-dark hover:shadow-xl hover:shadow-amber/30"
        >
          <Link href="#empieza" className="gap-3">
            ¿Eres nuevo? Empieza aquí
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
