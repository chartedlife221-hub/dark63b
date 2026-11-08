import { useEffect, useState } from "react";
import { MEDIA } from "../lib/env";
import { CloseIcon, MenuIcon, SoundOffIcon, SoundOnIcon } from "./Icons";

const LINKS = [
  { href: "#story", label: "Story" },
  { href: "#mission", label: "Mission" },
  { href: "#coin", label: "Coin" },
  { href: "#transparency", label: "Transparency" },
  { href: "#roadmap", label: "Roadmap" },
];

export function Nav({ sound, onSound }: { sound: boolean; onSound: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <a className="skip" href="#story">
        Skip to content
      </a>
      <a className="nav__mark" href="#top" aria-label="DARK6.3B, back to top">
        <img src={MEDIA.logo640} width={36} height={36} alt="" />
        <span>DARK6.3B</span>
      </a>

      <nav className="nav__links" id="nav-links" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>

      <div className="nav__tools">
        <button
          type="button"
          className="sound-toggle"
          onClick={onSound}
          aria-pressed={sound}
          aria-label={sound ? "Turn atmospheric sound off" : "Turn atmospheric sound on"}
        >
          {sound ? <SoundOnIcon /> : <SoundOffIcon />}
          <span className="sound-toggle__text">{sound ? "Sound on" : "Sound off"}</span>
        </button>
        <button
          type="button"
          className="icon-btn nav__menu"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
