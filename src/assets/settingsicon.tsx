export default function Settingsicon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width="100"
      height="100"
      fill="none"
    >
      {/* Gear */}
      <g fill="#1F6F8B">
        <rect
          x="18"
          y="52"
          width="92"
          height="24"
          rx="7"
          transform="rotate(0 64 64)"
          stroke="#F472B6"
          strokeWidth="2"
        />

        <rect
          x="18"
          y="52"
          width="92"
          height="24"
          rx="7"
          transform="rotate(45 64 64)"
          stroke="#F472B6"
          strokeWidth="2"
        />

        <rect
          x="18"
          y="52"
          width="92"
          height="24"
          rx="7"
          transform="rotate(90 64 64)"
          stroke="#F472B6"
          strokeWidth="2"
        />

        <rect
          x="18"
          y="52"
          width="92"
          height="24"
          rx="7"
          transform="rotate(135 64 64)"
          stroke="#F472B6"
          strokeWidth="2"
        />

        <circle cx="64" cy="64" r="38" fill="#0B132B" />
        <circle cx="64" cy="64" r="38" fill="#1F6F8B" />
      </g>

      {/* Center opening */}
      <circle
        cx="64"
        cy="64"
        r="20"
        fill="#0B132B"
        stroke="#F472B6"
        strokeWidth="3"
      />

      {/* Inner ring */}
      <circle
        cx="64"
        cy="64"
        r="28"
        fill="none"
        stroke="#F472B6"
        strokeWidth="2"
      />
    </svg>
  );
}
