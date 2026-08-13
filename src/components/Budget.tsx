import {
  BUDGET,
  BUDGET_NOTE,
  BUDGET_TOTAL,
  FUNDING,
  PER_MAND,
  STATED_AVAILABLE,
  STATED_BUFFER,
} from "@/data/trip";
import { kr } from "@/lib/links";
import { Reveal } from "./Reveal";

function Row({
  label,
  amount,
  sub = false,
}: {
  label: string;
  amount: number;
  sub?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-6 py-2.5 ${
        sub
          ? "border-t border-line font-medium"
          : "border-t border-line/60 text-ink-2"
      }`}
    >
      <span className="text-[14.5px]">{label}</span>
      <span
        className={`tnum shrink-0 text-[14.5px] ${
          amount < 0 ? "text-heat" : ""
        }`}
      >
        {kr(amount)} kr.
      </span>
    </div>
  );
}

export function Budget() {
  const priciestDay = BUDGET.filter((g) => g.label !== "Fast")
    .map((g) => ({
      label: g.label,
      sum: g.lines.reduce((a, b) => a + b.amount, 0),
    }))
    .sort((a, b) => b.sum - a.sum)[0];

  return (
    <section id="budget" className="scroll-mt-24">
      <Reveal>
        <div className="border-t border-line pt-10">
          <p className="text-[13px] text-ink-3">Budget</p>
          <h2 className="display mt-2.5 text-[clamp(1.9rem,5.5vw,2.9rem)]">
            Hvad det koster
          </h2>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-2">
            Nogle priser er faste — fly og bolig. Resten er skøn, og
            restaurantbesøg kan svinge.
          </p>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { k: "Samlet budget", v: `${kr(BUDGET_TOTAL)} kr.` },
            { k: "Pr. mand", v: "8.500 kr." },
            {
              k: "Dyreste dag",
              v: `${priciestDay.label} · ${kr(priciestDay.sum)} kr.`,
            },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl bg-surface p-4 shadow-sm sm:p-5"
            >
              <p className="text-[13px] text-ink-3">{s.k}</p>
              <p className="tnum mt-1.5 text-[19px] font-medium sm:text-[21px]">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-[1.35fr_1fr]">
        <Reveal delay={90}>
          <div>
            {BUDGET.map((group) => {
              const sum = group.lines.reduce((a, b) => a + b.amount, 0);
              return (
                <div key={group.label} className="mb-7">
                  <div className="flex items-baseline justify-between gap-6">
                    <h3 className="text-[15px] font-medium">{group.label}</h3>
                    <span className="tnum text-[13.5px] text-ink-3">
                      {kr(sum)} kr.
                    </span>
                  </div>
                  <div className="mt-1.5">
                    {group.lines.map((l) => (
                      <Row key={l.label} label={l.label} amount={l.amount} />
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex items-baseline justify-between gap-6 border-t-2 border-line-strong pt-3.5">
              <span className="text-[16px] font-medium">I alt</span>
              <span className="tnum text-[16px] font-medium">
                {kr(BUDGET_TOTAL)} kr.
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-8">
            <div>
              <h3 className="text-[15px] font-medium">Kassen</h3>
              <div className="mt-1.5">
                {FUNDING.map((f) => (
                  <Row
                    key={f.label}
                    label={f.label}
                    amount={f.amount}
                    sub={f.sub}
                  />
                ))}
                <Row
                  label="Buffer"
                  amount={STATED_BUFFER}
                  sub
                />
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-3">
                Beløbene er gengivet som de står i programmet.
              </p>
            </div>

            <div>
              <h3 className="text-[15px] font-medium">Pr. mand</h3>
              <div className="mt-1.5">
                {PER_MAND.map((f) => (
                  <Row
                    key={f.label}
                    label={f.label}
                    amount={f.amount}
                    sub={"sub" in f ? Boolean(f.sub) : false}
                  />
                ))}
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-3">
                De 1.500 kr. betales til Koks inden turen.
              </p>
            </div>

            <div className="rounded-xl bg-heat-soft p-4 sm:p-5">
              <p className="text-[13.5px] font-medium text-heat">
                Regnestykket halter
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                {BUDGET_NOTE}
              </p>
              <p className="tnum mt-3 text-[13px] text-ink-3">
                {kr(STATED_AVAILABLE)} − {kr(BUDGET_TOTAL)} ={" "}
                {kr(STATED_AVAILABLE - BUDGET_TOTAL)} kr.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
