import "../index.css";

export default function Journalicon() {
  return (
    <div className="book relative">
      <svg
        viewBox="310 110 100 370"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="mirror"
      >
        <defs>
          <linearGradient id="coverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#5C2A2E" />
            <stop offset="100%" stop-color="#4A2124" />
          </linearGradient>
          <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3A1A1D" />
            <stop offset="100%" stop-color="#2E1417" />
          </linearGradient>
          <linearGradient id="topEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F3E9D2" />
            <stop offset="100%" stop-color="#E4D3AC" />
          </linearGradient>
        </defs>

        <g id="book">
          <path
            d="M 460 116 L 502 118 L 502 448 L 460  Z"
            fill="#F3E9D2"
            stroke="#1E1210"
            stroke-width="4"
            stroke-linejoin="round"
          />

          <path
            d="M 461 470.5 L 502 451 L 502 116 L 262 116 Q 212 124 220 139 Z"
            fill="url(#topEdgeGrad)"
            stroke="#1E1210"
            stroke-width="4"
            stroke-linejoin="round"
          />

          <g stroke="#1E1210" stroke-width="1.4" opacity="0.7">
            <line x1="265" y1="120" x2="495" y2="120" />
            <line x1="258" y1="124" x2="488" y2="124" />
            <line x1="251" y1="128" x2="481" y2="128" />
            <line x1="244" y1="132" x2="474" y2="132" />
            <line x1="237" y1="136" x2="467" y2="136" />
          </g>

          <g stroke="#1E1210" stroke-width="1.6" opacity="0.7">
            <line x1="467" y1="136" x2="467" y2="466" />
            <line x1="474" y1="132" x2="474" y2="462" />
            <line x1="481" y1="128" x2="481" y2="458" />
            <line x1="488" y1="124" x2="488" y2="454" />
            <line x1="495" y1="120" x2="495" y2="450" />
            <line
              x1="460"
              y1="471"
              x2="501"
              y2="451.4"
              stroke="#F3E9D2"
              stroke-width="4"
              opacity="1"
            />
          </g>

          <rect
            x="220"
            y="140"
            width="240"
            height="330"
            fill="url(#coverGrad)"
            stroke="#1E1210"
            stroke-width="5"
          />

          <rect
            x="238"
            y="158"
            width="204"
            height="294"
            fill="none"
            stroke="#7A4A3E"
            stroke-width="2"
            opacity="0.55"
          />
        </g>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="40 -200 400 920"
        width="100%"
        height="100%"
        className="absolute bottom-0"
      >
        <defs>
          <clipPath id="mirrorGlassClip">
            <ellipse cx="200" cy="260" rx="125" ry="185" />
          </clipPath>
        </defs>

        <ellipse
          cx="200"
          cy="260"
          rx="160"
          ry="220"
          fill="#FFC857"
          stroke="#1D1E2C"
          stroke-width="8"
        />

        <ellipse
          cx="200"
          cy="260"
          rx="142"
          ry="202"
          fill="none"
          stroke="#1D1E2C"
          stroke-width="5"
        />

        <circle
          cx="200"
          cy="32"
          r="16"
          fill="#FFC857"
          stroke="#1D1E2C"
          stroke-width="6"
        />
        <circle cx="200" cy="32" r="6" fill="#FF5A5F" />

        <circle
          cx="200"
          cy="488"
          r="16"
          fill="#FFC857"
          stroke="#1D1E2C"
          stroke-width="6"
        />
        <circle cx="200" cy="488" r="6" fill="#FF5A5F" />

        <path
          d="M 80 130 C 100 85, 140 55, 190 48"
          stroke="#FFFFFF"
          stroke-width="8"
          stroke-linecap="round"
          fill="none"
        />

        <ellipse
          cx="200"
          cy="260"
          rx="125"
          ry="185"
          fill="#A8E6CF"
          stroke="#1D1E2C"
          stroke-width="8"
        />

        <g clip-path="url(#mirrorGlassClip)">
          <polygon
            points="120,50 170,50 60,470 10,470"
            fill="#FFFFFF"
            opacity="0.45"
          />
          <polygon
            points="190,50 215,50 105,470 80,470"
            fill="#FFFFFF"
            opacity="0.3"
          />

          <g
            stroke="#1D1E2C"
            stroke-width="6"
            stroke-linejoin="round"
            stroke-linecap="round"
          >
            <circle cx="200" cy="185" r="42" fill="#2B2D42" />

            <path
              d="M 160 220 C 150 255, 100 285, 70 345 C 50 385, 45 460, 45 460 L 355 460 C 355 460, 350 385, 330 345 C 300 285, 250 220, 240 220 Z"
              fill="#2B2D42"
            />
          </g>

          <g>
            <path
              d="M 200 295
               C 185 265, 145 285, 145 310
               C 145 340, 175 360, 200 380
               C 225 360, 255 340, 255 310
               C 255 285, 215 265, 200 295 Z"
              fill="#FF3366"
              stroke="#1D1E2C"
              stroke-width="6"
              stroke-linejoin="round"
            />

            <path
              d="M 165 300 C 160 305, 158 315, 160 322"
              stroke="#FFFFFF"
              stroke-width="4"
              stroke-linecap="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="220 70 370 320"
        width="100%"
        height="100%"
        className="absolute bottom-0"
      >
        <g transform="translate(320, 310) rotate(-32)">
          <rect
            x="-14"
            y="-115"
            width="28"
            height="22"
            rx="4"
            fill="#FF5A5F"
            stroke="#1D1E2C"
            stroke-width="6"
          />
          <rect
            x="-11"
            y="-93"
            width="22"
            height="15"
            fill="#E2E8F0"
            stroke="#1D1E2C"
            stroke-width="5"
          />

          <rect
            x="-13"
            y="-78"
            width="26"
            height="120"
            rx="3"
            fill="#4EA8DE"
            stroke="#1D1E2C"
            stroke-width="6"
          />
          <path
            d="M -13 -40 L 13 -40 M -13 0 L 13 0 M -13 20 L 13 20"
            stroke="#1D1E2C"
            stroke-width="4"
          />

          <path
            d="M 13 -90 L 22 -90 L 22 -35 L 13 -35"
            fill="#FFC857"
            stroke="#1D1E2C"
            stroke-width="5"
            stroke-linejoin="round"
          />

          <rect
            x="-13"
            y="42"
            width="26"
            height="28"
            fill="#2B2D42"
            stroke="#1D1E2C"
            stroke-width="6"
          />

          <polygon
            points="-13,70 13,70 0,108"
            fill="#FFC857"
            stroke="#1D1E2C"
            stroke-width="6"
            stroke-linejoin="round"
          />
          <polygon points="-5,96 5,96 0,108" fill="#1D1E2C" />
          <line
            x1="0"
            y1="70"
            x2="0"
            y2="92"
            stroke="#1D1E2C"
            stroke-width="4"
          />

          <path
            d="M -6 -60 L -6 20"
            stroke="#FFFFFF"
            stroke-width="4"
            stroke-linecap="round"
            fill="none"
            opacity="0.6"
          />
        </g>{" "}
      </svg>
    </div>
  );
}
