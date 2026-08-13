"use client";

import { CREW_NAMES, EVENT_LOOKUP } from "@/data/trip";
import { usePhotoStore } from "./PhotoStore";
import { PhotoScatter } from "./PhotoScatter";

/** Everything the group shot, gathered at the end of the programme and kept
 *  in trip order so it reads as a record of the days. */
export function PhotoGallery() {
  const store = usePhotoStore();
  if (!store) return null;

  const groups = Object.entries(
    store.all.reduce<Record<string, typeof store.all>>((acc, p) => {
      (acc[p.eventId] ??= []).push(p);
      return acc;
    }, {}),
  )
    .map(([eventId, photos]) => ({
      eventId,
      photos,
      where: EVENT_LOOKUP[eventId],
    }))
    .filter((g) => g.where)
    .sort(
      (a, b) =>
        a.where!.dayIndex - b.where!.dayIndex ||
        a.eventId.localeCompare(b.eventId),
    );

  const perPerson = CREW_NAMES.map((name) => ({
    name,
    count: store.all.filter((p) => p.who === name).length,
  })).filter((p) => p.count > 0);

  return (
    <section id="billeder" className="scroll-mt-24">
      <div className="border-t border-line pt-10">
        <p className="text-[13px] text-ink-3">Billeder</p>
        <h2 className="display mt-2.5 text-[clamp(1.9rem,5.5vw,2.9rem)]">
          Alt vi fangede
        </h2>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-2">
          {store.all.length === 0
            ? "Her samler vi billederne fra turen. Tryk «Upload billeder» ude ved et punkt i programmet, så lander de her."
            : "Alle billeder fra turen, i den rækkefølge vi tog dem."}
        </p>

        {store.all.length > 0 && (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="text-[13px] text-ink-3">I alt</dt>
              <dd className="tnum mt-0.5 text-[19px]">{store.all.length}</dd>
            </div>
            {perPerson.map((p) => (
              <div key={p.name}>
                <dt className="text-[13px] text-ink-3">{p.name}</dt>
                <dd className="tnum mt-0.5 text-[19px]">{p.count}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {groups.length > 0 && (
        <div className="mt-10 space-y-9">
          {groups.map(({ eventId, photos, where }) => (
            <div key={eventId}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-[15.5px] font-medium">{where!.title}</h3>
                <p className="text-[13px] text-ink-3">
                  {where!.weekday} den {where!.date}. august
                </p>
              </div>
              <p className="mt-0.5 text-[12.5px] text-ink-3">
                {[...new Set(photos.map((p) => p.who))].join(", ")}
              </p>
              <div className="mt-3">
                <PhotoScatter photos={photos} size={104} overlap={20} />
              </div>
            </div>
          ))}
        </div>
      )}

      {store.who && (
        <p className="mt-9 text-[13px] text-ink-3">
          Du uploader som{" "}
          <span className="font-medium text-ink-2">{store.who}</span>.{" "}
          <button
            onClick={() => store.setWho("")}
            className="press underline decoration-line-strong underline-offset-2 hover:text-ink-2"
          >
            Skift
          </button>
        </p>
      )}
    </section>
  );
}
