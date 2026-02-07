import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/sections/countdown";
import { getNextSundayServiceDate, mockConfig } from "@/lib/mock-data";

export function NextService() {
  const serviceTime = "Domingo, 11:00";
  const address = mockConfig.contacto.direccion.replace("\n", ", ");
  const nextServiceDate = getNextSundayServiceDate().toISOString();

  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-5xl px-4">
      <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          {/* Service info */}
          <div className="text-center lg:text-left">
            <p className="mb-1 text-xs font-bold tracking-widest text-amber">
              PRÓXIMO SERVICIO
            </p>
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">
              {serviceTime}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {address}
            </p>
          </div>

          {/* Countdown */}
          <Countdown targetDate={nextServiceDate} />

          {/* Actions */}
          <Button
            asChild
            className="h-10 gap-2 rounded-full bg-amber px-5 text-xs font-semibold text-white shadow-lg shadow-amber/25 hover:bg-amber-dark hover:shadow-xl hover:shadow-amber/30"
          >
            <Link href="/contacto">
              <MapPin className="size-4" />
              Cómo llegar
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
