export default function Settingsicon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width="100"
      height="100"
    >
      <defs>
        <filter
          id="light-theme-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="8"
            flood-color="#0F172A"
            flood-opacity="0.12"
          />
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            flood-color="#4F46E5"
            flood-opacity="0.18"
          />
        </filter>

        <linearGradient id="gear-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366F1" />
          <stop offset="50%" stop-color="#3B82F6" />
          <stop offset="100%" stop-color="#0EA5E9" />
        </linearGradient>

        <linearGradient
          id="inner-ring-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.1" />
        </linearGradient>

        <mask id="gear-center-hole">
          <rect width="128" height="128" fill="#FFFFFF" />
          <circle cx="64" cy="64" r="20" fill="#000000" />
        </mask>
      </defs>

      <g filter="url(#light-theme-shadow)">
        <g mask="url(#gear-center-hole)" fill="url(#gear-gradient)">
          <circle cx="64" cy="64" r="38" />

          <rect
            x="18"
            y="52"
            width="92"
            height="24"
            rx="7"
            ry="7"
            transform="rotate(0 64 64)"
          />
          <rect
            x="18"
            y="52"
            width="92"
            height="24"
            rx="7"
            ry="7"
            transform="rotate(45 64 64)"
          />
          <rect
            x="18"
            y="52"
            width="92"
            height="24"
            rx="7"
            ry="7"
            transform="rotate(90 64 64)"
          />
          <rect
            x="18"
            y="52"
            width="92"
            height="24"
            rx="7"
            ry="7"
            transform="rotate(135 64 64)"
          />
        </g>

        <circle
          cx="64"
          cy="64"
          r="28"
          fill="none"
          stroke="url(#inner-ring-gradient)"
          stroke-width="2"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
