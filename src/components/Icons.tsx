type IconProps = { className?: string };

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const PlayIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const PauseIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M8 5v14M16 5v14" strokeWidth={2.4} />
  </svg>
);

export const ReplayIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7" />
    <path d="M4 4v4.5h4.5" />
  </svg>
);

export const SoundOnIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
  </svg>
);

export const SoundOffIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </svg>
);

export const ExpandIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const ExternalIcon = ({ className }: IconProps) => (
  <svg {...base} width={14} height={14} className={className}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);
