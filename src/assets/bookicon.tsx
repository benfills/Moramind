export default function Bookicon() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="18 50 165 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="8"
            flood-color="#1E293B"
            flood-opacity="0.2"
          />
        </filter>
        <filter id="page-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            flood-color="#0F172A"
            flood-opacity="0.1"
          />
        </filter>
        <linearGradient
          id="cover-grad"
          x1="20"
          y1="30"
          x2="180"
          y2="170"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stop-color="#6366F1" />
          <stop offset="100%" stop-color="#4338CA" />
        </linearGradient>
        <linearGradient
          id="left-page-grad"
          x1="25"
          y1="50"
          x2="100"
          y2="140"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#F1F5F9" />
        </linearGradient>
        <linearGradient
          id="right-page-grad"
          x1="175"
          y1="50"
          x2="100"
          y2="140"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#E2E8F0" />
        </linearGradient>
        <linearGradient id="bookmark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F43F5E" />
          <stop offset="100%" stop-color="#BE123C" />
        </linearGradient>
      </defs>

      <path
        d="M 20 62 C 20 54, 90 44, 100 52 C 110 44, 180 54, 180 62 L 180 148 C 180 156, 108 146, 100 154 C 92 146, 20 156, 20 148 Z"
        fill="url(#cover-grad)"
        filter="url(#drop-shadow)"
      />
      <path
        d="M 26 56 C 55 48, 88 53, 97 60 L 97 144 C 88 137, 55 132, 26 140 Z"
        fill="#CBD5E1"
      />
      <path
        d="M 174 56 C 145 48, 112 53, 103 60 L 103 144 C 112 137, 145 132, 174 140 Z"
        fill="#94A3B8"
      />
      <path
        d="M 28 53 C 55 45, 88 50, 98 57 L 98 140 C 88 133, 55 128, 28 136 Z"
        fill="url(#left-page-grad)"
        filter="url(#page-shadow)"
      />
      <path
        d="M 172 53 C 145 45, 112 50, 102 57 L 102 140 C 112 133, 145 128, 172 136 Z"
        fill="url(#right-page-grad)"
        filter="url(#page-shadow)"
      />

      <path
        d="M 42 74 C 55 69, 73 72, 84 76"
        stroke="#94A3B8"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.6"
      />
      <path
        d="M 42 89 C 55 84, 73 87, 84 91"
        stroke="#94A3B8"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.6"
      />
      <path
        d="M 42 104 C 55 99, 73 102, 84 106"
        stroke="#94A3B8"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.6"
      />
      <path
        d="M 158 74 C 145 69, 127 72, 116 76"
        stroke="#94A3B8"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.6"
      />
      <path
        d="M 158 89 C 145 84, 127 87, 116 91"
        stroke="#94A3B8"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.6"
      />
      <path
        d="M 158 104 C 145 99, 127 102, 116 106"
        stroke="#94A3B8"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.6"
      />

      <path
        d="M 98 57 C 100 58, 100 139, 100 140 C 100 139, 100 58, 102 57 Z"
        fill="#0F172A"
        opacity="0.12"
      />

      <path
        d="M 96 52 L 108 52 L 108 116 L 102 109 L 96 116 Z"
        fill="url(#bookmark-grad)"
        filter="url(#page-shadow)"
      />

      <g id="glasses" opacity="0.9">
        <ellipse
          cx="78"
          cy="95"
          rx="16"
          ry="10"
          fill="none"
          stroke="#334155"
          stroke-width="3"
        />
        <ellipse
          cx="122"
          cy="95"
          rx="16"
          ry="10"
          fill="none"
          stroke="#334155"
          stroke-width="3"
        />
        <path
          d="M 94 95 C 97 92, 103 92, 106 95"
          stroke="#334155"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
        />
        <path
          d="M 62 93 C 56 91, 50 91, 45 92"
          stroke="#334155"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
        />
        <path
          d="M 138 93 C 144 91, 150 91, 155 92"
          stroke="#334155"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
        />
      </g>
    </svg>
  );
}
