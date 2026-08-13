"use client";

import { upload } from "@vercel/blob/client";
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

/** Pathname doubles as the record, so the name has to survive a round trip
 *  through it: letters, digits, and spaces stored as hyphens. */
function slug(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}0-9-]/gu, "")
    .slice(0, 40);
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
      const ext =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";
      const rand = Math.random().toString(36).slice(2, 10);
      const pathname = `photos/${eventId}/${slug(name) || "anonym"}--${rand}.${ext}`;

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/photos",
        contentType: file.type,
      });

      setPhotos((prev) => [
        ...prev,
        {
          url: blob.url,
          pathname,
          eventId,
          who: (slug(name) || "anonym").replace(/-/g, " "),
          at: new Date().toISOString(),
        },
      ]);
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
