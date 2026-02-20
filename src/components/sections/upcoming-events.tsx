"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Evento {
  id: string;
  nombre: string;
  descripcion: string | null;
  fecha: string;
  horaInicio: string;
  horaFin: string | null;
  ubicacion: string | null;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function UpcomingEvents() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/eventos")
      .then((res) => res.json())
      .then((data) => {
        setEventos(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="border-t border-border bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (eventos.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-amber">
            PRÓXIMOS EVENTOS
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Únete a nuestras actividades
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Estas son algunas de las próximas actividades que hemos preparado
            para nuestra comunidad.
          </p>
        </div>

        {/* Events grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="flex flex-col rounded-2xl border border-border/50 bg-cream p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2 text-amber">
                <CalendarDays className="size-5" />
                <span className="text-sm font-semibold capitalize">
                  {formatDate(evento.fecha)}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {evento.nombre}
              </h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {evento.descripcion}
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{evento.horaInicio}</span>
                </div>
                {evento.ubicacion && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span className="line-clamp-1">{evento.ubicacion}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-amber px-8 text-sm font-semibold text-amber hover:bg-amber hover:text-white"
          >
            <Link href="/horarios">Ver todos los horarios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
