import { DAYS } from "@/data/trip";
import { Budget } from "@/components/Budget";
import { DayNav } from "@/components/DayNav";
import { DaySection } from "@/components/DaySection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MapSection } from "@/components/map/MapSection";
import { NowNext } from "@/components/NowNext";
import { Practical } from "@/components/Practical";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { PhotoStoreProvider } from "@/components/photos/PhotoStore";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="mt-14">
        <NowNext />
      </div>

      {/* Not wrapped in anything: a sticky element can only travel inside its
          parent's box, and a snug wrapper would pin it to nothing. */}
      <DayNav />

      <main className="mx-auto max-w-5xl px-5 pt-16">
        <PhotoStoreProvider>
          <div className="space-y-20">
            {DAYS.map((day, i) => (
              <DaySection key={day.id} day={day} index={i} />
            ))}
          </div>

          <div className="mt-20">
            <Reveal>
              <MapSection />
            </Reveal>
          </div>

          <div className="mt-20">
            <Budget />
          </div>

          <div className="mt-20">
            <Practical />
          </div>

          <div className="mt-20">
            <PhotoGallery />
          </div>
        </PhotoStoreProvider>
      </main>

      <Footer />
    </>
  );
}
