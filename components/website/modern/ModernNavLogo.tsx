"use client";

export function ModernNavLogo({
  brandColor = "#0166FF",
  title = "CRM Dubai",
}: {
  brandColor?: string;
  title?: string;
}) {
  return (
    <svg
      className="h-9 w-auto max-h-10 shrink-0 sm:h-10"
      viewBox="0 0 320 46"
      fill="none"
      preserveAspectRatio="xMinYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g transform="translate(0, 3)">
        <circle cx="20" cy="20" r="18" fill="white" stroke={brandColor} strokeWidth="2" />
        {/* Left semicircle (vertical split): counter-clockwise from top */}
        <path d="M 20 2 A 18 18 0 0 0 20 38 Z" fill={brandColor} />
      </g>
      <text
        x="52"
        y="30"
        fill={brandColor}
        style={{ fontFamily: "inherit", fontSize: "20px", fontWeight: 700 }}
      >
        {title}
      </text>
    </svg>
  );
}
