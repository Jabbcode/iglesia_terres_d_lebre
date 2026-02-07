"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string;
}

function calcTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return { dias: 0, horas: 0, min: 0 };

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const min = Math.floor((diff / (1000 * 60)) % 60);

  return { dias, horas, min };
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    calcTimeLeft(new Date(targetDate))
  );

  useEffect(() => {
    const target = new Date(targetDate);
    setTimeLeft(calcTimeLeft(target));

    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(target));
    }, 60_000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { value: String(timeLeft.dias).padStart(2, "0"), label: "Días" },
    { value: String(timeLeft.horas).padStart(2, "0"), label: "Horas" },
    { value: String(timeLeft.min).padStart(2, "0"), label: "Min" },
  ];

  return (
    <div className="flex gap-4">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="flex size-16 items-center justify-center rounded-xl bg-cream text-2xl font-bold text-foreground">
            {item.value}
          </div>
          <span className="mt-1 block text-xs text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
