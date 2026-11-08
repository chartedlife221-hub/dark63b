import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { MEDIA, formatTime } from "../lib/env";
import { CloseIcon, ExpandIcon, PauseIcon, PlayIcon, ReplayIcon, SoundOffIcon, SoundOnIcon } from "./Icons";

type Status = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

export function FilmViewer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      await v.play();
    } catch {
      // Some browsers refuse audible playback; fall back to muted so the film still plays.
      v.muted = true;
      setMuted(true);
      try {
        await v.play();
      } catch {
        setStatus("paused");
      }
    }
  }, []);

  // Open / close the native modal dialog.
  useEffect(() => {
    const dialog = dialogRef.current;
    const v = videoRef.current;
    if (!dialog || !v) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.classList.add("is-locked");
      if (!v.getAttribute("src")) v.src = MEDIA.film;
      v.currentTime = 0;
      v.muted = false;
      setMuted(false);
      setStatus("loading");
      void play();
    } else {
      v.pause();
      if (dialog.open) dialog.close();
      document.documentElement.classList.remove("is-locked");
      setStatus("idle");
    }
  }, [open, play]);

  // Media events.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const on = (type: string, fn: () => void) => {
      v.addEventListener(type, fn);
      return () => v.removeEventListener(type, fn);
    };
    const offs = [
      on("playing", () => setStatus("playing")),
      on("pause", () => setStatus((s) => (s === "ended" || s === "error" ? s : "paused"))),
      on("waiting", () => setStatus("loading")),
      on("ended", () => setStatus("ended")),
      on("error", () => {
        if (v.getAttribute("src")) setStatus("error");
      }),
      on("timeupdate", () => setTime(v.currentTime)),
      on("loadedmetadata", () => setDuration(v.duration)),
      on("volumechange", () => setMuted(v.muted)),
    ];
    return () => offs.forEach((off) => off());
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) void play();
    else v.pause();
  }, [play]);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void play();
  }, [play]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  }, []);

  const fullscreen = useCallback(() => {
    const v = videoRef.current as FsVideo | null;
    const stage = v?.parentElement;
    if (!v || !stage) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (stage.requestFullscreen) void stage.requestFullscreen();
    else v.webkitEnterFullscreen?.();
  }, []);

  const retry = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setStatus("loading");
    v.load();
    void play();
  }, [play]);

  const onKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const v = videoRef.current;
    if (!v) return;
    const onRange = target instanceof HTMLInputElement;
    if ((e.key === " " && !(target instanceof HTMLButtonElement)) || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "m") toggleMute();
    else if (e.key === "f") fullscreen();
    else if (!onRange && e.key === "ArrowRight") v.currentTime = Math.min(v.duration || 0, v.currentTime + 2);
    else if (!onRange && e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 2);
  };

  const playing = status === "playing" || status === "loading";

  return (
    <dialog
      ref={dialogRef}
      className="viewer"
      aria-label="DARK6.3B film"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={onKey}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="viewer__inner">
        <button type="button" className="viewer__close icon-btn" onClick={onClose} aria-label="Close film">
          <CloseIcon />
        </button>

        <div className="viewer__stage" data-status={status}>
          <video
            ref={videoRef}
            className="viewer__video"
            playsInline
            preload="none"
            poster={MEDIA.poster}
            onClick={toggle}
            aria-label="DARK6.3B cinematic film, 9 seconds"
          />

          {status === "loading" && <div className="viewer__spinner" role="status" aria-label="Loading film" />}

          {status === "ended" && (
            <button type="button" className="viewer__overlay-btn" onClick={replay}>
              <ReplayIcon />
              Replay
            </button>
          )}

          {status === "error" && (
            <div className="viewer__error" role="alert">
              <p>The film didn't load. Check your connection, then try again.</p>
              <div className="viewer__error-actions">
                <button type="button" className="btn btn--gold" onClick={retry}>
                  Try again
                </button>
                <a className="btn btn--ghost" href={MEDIA.film} download>
                  Download the film
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="viewer__controls">
          <button
            type="button"
            className="icon-btn"
            onClick={status === "ended" ? replay : toggle}
            aria-label={status === "ended" ? "Replay" : playing ? "Pause" : "Play"}
          >
            {status === "ended" ? <ReplayIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <input
            className="viewer__scrub"
            type="range"
            min={0}
            max={duration || 9}
            step={0.05}
            value={time}
            onChange={(e) => {
              const v = videoRef.current;
              if (v) v.currentTime = Number(e.target.value);
            }}
            aria-label="Seek"
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            style={{ "--pct": `${duration ? (time / duration) * 100 : 0}%` } as CSSProperties}
          />
          <span className="viewer__time" aria-hidden="true">
            {formatTime(time)} / {formatTime(duration || 9)}
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleMute}
            aria-pressed={!muted}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
          >
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          </button>
          <button type="button" className="icon-btn" onClick={replay} aria-label="Replay from the start">
            <ReplayIcon />
          </button>
          <button type="button" className="icon-btn" onClick={fullscreen} aria-label="Full screen">
            <ExpandIcon />
          </button>
        </div>
      </div>
    </dialog>
  );
}
