"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Flame } from "lucide-react";

const PROMO_END_DATE = process.env.NEXT_PUBLIC_EDSEC_PROMO_END_DATE || "2026-09-30T23:59:59+01:00";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemaining(): Remaining {
  const difference = Math.max(0, new Date(PROMO_END_DATE).getTime() - Date.now());

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export default function LaunchPromoCountdown() {
  const [remaining, setRemaining] = useState<Remaining>(getRemaining);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(getRemaining());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const units = useMemo(
    () => [
      { label: "Days", value: remaining.days },
      { label: "Hours", value: remaining.hours },
      { label: "Minutes", value: remaining.minutes },
      { label: "Seconds", value: remaining.seconds },
    ],
    [remaining]
  );

  return (
    <div className="rounded-3xl border border-blue-200 bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Flame className="h-3.5 w-3.5" />
            Launch offer is live
          </div>

          <h3 className="mt-3 text-xl font-bold text-slate-950 sm:text-2xl">
            Secure your place before the promo ends.
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Promo pricing is available for a limited launch window. Contact EDSEC if you need help choosing a program.
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Clock3 className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-semibold uppercase tracking-wider">Time left</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="rounded-2xl bg-slate-950 px-2 py-4 text-center text-white sm:px-4">
            <div className="text-2xl font-black tabular-nums sm:text-3xl">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
