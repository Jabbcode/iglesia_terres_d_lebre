import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-amber">
          TE ESTÁBAMOS ESPERANDO
        </p>
        <h1 className="mb-6 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
          Bienvenidos{" "}
          <span className="font-serif italic text-amber">a Casa</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80">
          Somos una comunidad de fe donde cada persona encuentra su lugar.
          Un espacio para crecer, servir y vivir en el amor de Dios.
        </p>
        <Button
          asChild
          className="h-12 rounded-full bg-amber px-8 text-sm font-bold tracking-wider text-white shadow-lg shadow-amber/25 hover:bg-amber-dark hover:shadow-xl hover:shadow-amber/30"
        >
          <Link href="/horarios">Ver servicios</Link>
        </Button>
      </div>
    </section>
  );
}
