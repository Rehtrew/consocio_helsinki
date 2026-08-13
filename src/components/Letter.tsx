import { Reveal } from "./Reveal";

export function Letter() {
  return (
    <Reveal>
      <section className="border-t border-line pt-10">
        <div className="max-w-2xl">
          <p className="text-[13px] text-ink-3">Fra invitationen</p>
          <blockquote className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-2 sm:text-[18px]">
            <p className="display text-[22px] text-ink sm:text-[25px]">
              Kære venner
            </p>
            <p>
              Til august drager vi mod Helsinki for at nyde god mad, byen
              (pigerne?!), naturen, forskellige typer saunaer og hinandens
              selskab.
            </p>
            <p>
              I får her et program i overskrifter. Der vil være steder i
              programmet, hvor nogle af jer får til opgave at finde en bar, et
              kaffested eller lignende. Heldigvis er Helsinki spækket med gode
              caféer, restauranter og barer.
            </p>
            <p>
              I må gerne sørge for at pakke badebukser, håndklæde, vandresko og
              tøj I kan vandre i.
            </p>
            <p>Jeg opdaterer løbende programmet, hvis der kommer ændringer.</p>
          </blockquote>
          <p className="display mt-6 text-[20px] italic text-heat">
            Og ja, #såskideværemeddet…
          </p>
        </div>
      </section>
    </Reveal>
  );
}
