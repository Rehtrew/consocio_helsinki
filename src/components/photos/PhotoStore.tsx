"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type TripPhoto = {
  url: string;
  pathname: string;
  eventId: string;
  who: string;
  at: string;
};

type Store = {
  enabled: boolean;
  loading: boolean;
  byEvent: Record<string, TripPhoto[]>;
  who: string;
  setWho: (name: string) => void;
  add: (eventId: string, file: File, who: string) => Promise<void>;
  remove: (photo: TripPhoto) => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

const NAME_KEY = "consocio:navn";

/** Two passes: a normal one, then a harder one if the first is still too big
 *  for a serverless request body. Anything already small goes up untouched so
 *  small PNGs keep their transparency. */
const PASSES = [
  { edge: 2400, quality: 0.85 },
  { edge: 1600, quality: 0.78 },
];
const LEAVE_ALONE_UNDER = 1_000_000;
const BODY_LIMIT = 3_800_000;

async function shrink(file: File, edge: number, quality: number) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
}

/** Phone photos are several megabytes. Shrinking them in the browser makes
 *  the upload quick on hotel wifi and keeps the Blob store small. */
async function prepare(file: File): Promise<File> {
  const known = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (known && file.size <= LEAVE_ALONE_UNDER) return file;

  if (typeof createImageBitmap === "function") {
    for (const { edge, quality } of PASSES) {
      try {
        const blob = await shrink(file, edge, quality);
        if (blob && blob.size <= BODY_LIMIT) {
          return new File([blob], "foto.jpg", { type: "image/jpeg" });
        }
      } catch {
        break;
      }
    }
  }

  if (known && file.size <= BODY_LIMIT) return file;
  throw new Error("Billedet er for stort til at blive uploadet");
}

export function PhotoStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [photos, setPhotos] = useState<TripPhoto[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [who, setWhoState] = useState("");

  useEffect(() => {
    setWhoState(localStorage.getItem(NAME_KEY) ?? "");
  }, []);

  useEffect(() => {
    let live = true;
    fetch("/api/photos")
      .then((r) => r.json())
      .then((d) => {
        if (!live) return;
        setEnabled(Boolean(d.enabled));
        setPhotos(d.photos ?? []);
      })
      .catch(() => {})
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const setWho = useCallback((name: string) => {
    setWhoState(name);
    localStorage.setItem(NAME_KEY, name);
  }, []);

  const add = useCallback(
    async (eventId: string, file: File, name: string) => {
      const prepared = await prepare(file);

      const form = new FormData();
      form.set("eventId", eventId);
      form.set("who", name);
      form.set("file", prepared);

      const res = await fetch("/api/photos", { method: "POST", body: form });
      const saved = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(saved.error ?? `Upload fejlede (${res.status})`);

      setPhotos((prev) => [...prev, saved as TripPhoto]);
    },
    [],
  );

  const remove = useCallback(async (photo: TripPhoto) => {
    setPhotos((prev) => prev.filter((p) => p.pathname !== photo.pathname));
    await fetch(`/api/photos?pathname=${encodeURIComponent(photo.pathname)}`, {
      method: "DELETE",
    });
  }, []);

  const byEvent = useMemo(() => {
    const map: Record<string, TripPhoto[]> = {};
    for (const p of photos) (map[p.eventId] ??= []).push(p);
    return map;
  }, [photos]);

  const value = useMemo(
    () => ({ enabled, loading, byEvent, who, setWho, add, remove }),
    [enabled, loading, byEvent, who, setWho, add, remove],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePhotoStore() {
  return useContext(Ctx);
}
