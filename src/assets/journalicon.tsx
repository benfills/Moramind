import "../index.css";

export default function Journalicon() {
  return (
      <svg
        className="book relative"
        viewBox="10 105 340 330"
        width="80"
        height="80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0 20)">
          <rect
            x="60"
            y="80"
            width="260"
            height="340"
            rx="8"
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="6"
          />

          <rect
            x="80"
            y="100"
            width="220"
            height="300"
            rx="4"
            fill="none"
            stroke="#F472B6"
            strokeWidth="3"
          />
        </g>

        <g transform="translate(50 150) scale(0.5)">
          <ellipse
            cx="280"
            cy="250"
            rx="150"
            ry="200"
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="8"
          />

          <ellipse
            cx="280"
            cy="250"
            rx="125"
            ry="175"
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="5"
          />

          <g
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0 -50)"
          >
            <circle cx="280" cy="185" r="38" />

            <path
              d="
            M245 225
            Q220 245 200 275
            Q175 315 175 400
            L385 400
            Q385 315 360 275
            Q340 245 315 225
            Z
          "
            />

            <path
              d="
            M280 290
            C265 270 235 275 235 300
            C235 325 260 345 280 360
            C300 345 325 325 325 300
            C325 275 295 270 280 290
            Z
          "
            />
          </g>
        </g>

        <g transform="translate(95 365) rotate(-25)">
          <rect
            x="-12"
            y="-90"
            width="24"
            height="120"
            rx="5"
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="5"
          />

          <rect
            x="-12"
            y="-110"
            width="24"
            height="20"
            rx="4"
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="5"
          />

          <path
            d="M12 -85 L22 -85 L22 -40 L12 -40"
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          <line
            x1="-12"
            y1="-55"
            x2="12"
            y2="-55"
            stroke="#F472B6"
            strokeWidth="3"
          />

          <path
            d="M-12 30 L12 30 L0 65 Z"
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          <line
            x1="0"
            y1="40"
            x2="0"
            y2="60"
            stroke="#F472B6"
            strokeWidth="3"
          />
        </g>
      </svg>
  );
}
