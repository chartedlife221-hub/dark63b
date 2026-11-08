/** Asset paths are relative so the site works at any base path (e.g. /dark63b/ on GitHub Pages). */
export const asset = (path: string) => `./${path.replace(/^\/+/, "")}`;

export const MEDIA = {
  heroFilm720: asset("media/dark63b-film-720-silent.mp4"),
  heroFilm1080: asset("media/dark63b-film-1080-silent.mp4"),
  film: asset("media/dark63b-film-1080.mp4"),
  poster: asset("media/film-poster-end.jpg"),
  poster720: asset("media/film-poster-end-720.jpg"),
  logo640: asset("img/dark63b-logo-640.webp"),
  logo1200: asset("img/dark63b-logo-1200.webp"),
};

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function saveDataEnabled(): boolean {
  const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { connection?: { saveData?: boolean } }) : null;
  return Boolean(nav?.connection?.saveData);
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
