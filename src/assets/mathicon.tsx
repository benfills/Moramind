export default function Mathicon() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="math-light-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="10"
            floodColor="#0F172A"
            floodOpacity="0.1"
          />
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="4"
            floodColor="#4338CA"
            floodOpacity="0.08"
          />
        </filter>

        <filter
          id="element-light-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor="#1E293B"
            floodOpacity="0.12"
          />
        </filter>

        <linearGradient
          id="math-card-grad-light"
          x1="20"
          y1="20"
          x2="180"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EEF2FF" />
        </linearGradient>

        <linearGradient id="accent-cyan-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        <linearGradient id="accent-gold-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="accent-rose-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>

        <linearGradient
          id="grid-line-grad-light"
          x1="0"
          y1="0"
          x2="200"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
          <stop offset="50%" stopColor="#6366F1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect
        x="24"
        y="24"
        width="152"
        height="152"
        rx="32"
        fill="url(#math-card-grad-light)"
        stroke="#C7D2FE"
        strokeWidth="2"
        filter="url(#math-light-shadow)"
      />

      <line
        x1="40"
        y1="100"
        x2="160"
        y2="100"
        stroke="url(#grid-line-grad-light)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <line
        x1="100"
        y1="40"
        x2="100"
        y2="160"
        stroke="url(#grid-line-grad-light)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      <path
        d="M 40 115 C 60 70, 80 130, 100 100 C 120 70, 140 130, 160 85"
        stroke="url(#accent-cyan-light)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      <g filter="url(#element-light-shadow)">
        <circle
          cx="58"
          cy="58"
          r="16"
          fill="#EEF2FF"
          stroke="#A5B4FC"
          strokeWidth="1.5"
        />
        <path
          d="M 58 50 V 66 M 50 58 H 66"
          stroke="#312E81"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      <g filter="url(#element-light-shadow)">
        <circle
          cx="142"
          cy="58"
          r="16"
          fill="#EEF2FF"
          stroke="#A5B4FC"
          strokeWidth="1.5"
        />
        <path
          d="M 133 53 H 151 M 138 53 V 64 C 138 65.5 136.5 66 135 66 M 146 53 V 65 C 146 66 147 66.5 149 66"
          stroke="url(#accent-gold-light)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      <g filter="url(#element-light-shadow)">
        <circle
          cx="142"
          cy="142"
          r="16"
          fill="#EEF2FF"
          stroke="#A5B4FC"
          strokeWidth="1.5"
        />
        <line
          x1="134"
          y1="138"
          x2="150"
          y2="138"
          stroke="url(#accent-rose-light)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="134"
          y1="146"
          x2="150"
          y2="146"
          stroke="url(#accent-rose-light)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      <g filter="url(#element-light-shadow)">
        <path
          d="M 62 108 L 70 108 L 80 128 L 96 82 L 138 82"
          stroke="url(#accent-gold-light)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <path
          d="M 108 100 L 122 120 M 122 100 L 108 120"
          stroke="#1E1B4B"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      <circle cx="58" cy="142" r="3" fill="#0284C7" opacity="0.9" />
      <circle cx="100" cy="50" r="2.5" fill="#D97706" opacity="0.9" />
    </svg>
  );
}

// <svg
//   width="100"
//   height="200"
//   viewBox="0 0 200 200"
//   fill="none"
//   xmlns="http://www.w3.org/2000/svg"
// >
//   <defs>
//     <filter
//       id="math-drop-shadow"
//       x="-20%"
//       y="-20%"
//       width="140%"
//       height="140%"
//     >
//       <feDropShadow
//         dx="0"
//         dy="10"
//         stdDeviation="8"
//         flood-color="#0F172A"
//         flood-opacity="0.25"
//       />
//     </filter>

//     <filter
//       id="element-shadow"
//       x="-20%"
//       y="-20%"
//       width="140%"
//       height="140%"
//     >
//       <feDropShadow
//         dx="0"
//         dy="4"
//         stdDeviation="4"
//         flood-color="#000000"
//         flood-opacity="0.25"
//       />
//     </filter>

//     <linearGradient
//       id="math-card-grad"
//       x1="20"
//       y1="20"
//       x2="180"
//       y2="180"
//       gradientUnits="userSpaceOnUse"
//     >
//       <stop offset="0%" stop-color="#1E1B4B" />
//       <stop offset="100%" stop-color="#312E81" />
//     </linearGradient>

//     <linearGradient id="accent-cyan" x1="0" y1="0" x2="1" y2="1">
//       <stop offset="0%" stop-color="#38BDF8" />
//       <stop offset="100%" stop-color="#0284C7" />
//     </linearGradient>

//     <linearGradient id="accent-gold" x1="0" y1="0" x2="1" y2="1">
//       <stop offset="0%" stop-color="#FDE047" />
//       <stop offset="100%" stop-color="#F59E0B" />
//     </linearGradient>

//     <linearGradient id="accent-rose" x1="0" y1="0" x2="1" y2="1">
//       <stop offset="0%" stop-color="#FB7185" />
//       <stop offset="100%" stop-color="#E11D48" />
//     </linearGradient>

//     <linearGradient
//       id="grid-line-grad"
//       x1="0"
//       y1="0"
//       x2="200"
//       y2="0"
//       gradientUnits="userSpaceOnUse"
//     >
//       <stop offset="0%" stop-color="#6366F1" stop-opacity="0" />
//       <stop offset="50%" stop-color="#818CF8" stop-opacity="0.35" />
//       <stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
//     </linearGradient>
//   </defs>

//   <rect
//     x="24"
//     y="24"
//     width="152"
//     height="152"
//     rx="32"
//     fill="url(#math-card-grad)"
//     stroke="#4338CA"
//     stroke-width="2"
//     filter="url(#math-drop-shadow)"
//   />

//   <line
//     x1="40"
//     y1="100"
//     x2="160"
//     y2="100"
//     stroke="url(#grid-line-grad)"
//     stroke-width="1.5"
//     stroke-dasharray="4 4"
//   />
//   <line
//     x1="100"
//     y1="40"
//     x2="100"
//     y2="160"
//     stroke="url(#grid-line-grad)"
//     stroke-width="1.5"
//     stroke-dasharray="4 4"
//   />

//   <path
//     d="M 40 115 C 60 70, 80 130, 100 100 C 120 70, 140 130, 160 85"
//     stroke="url(#accent-cyan)"
//     stroke-width="3"
//     stroke-linecap="round"
//     fill="none"
//     opacity="0.8"
//   />

//   <g filter="url(#element-shadow)">
//     <circle
//       cx="58"
//       cy="58"
//       r="16"
//       fill="#3730A3"
//       stroke="#4F46E5"
//       stroke-width="1.5"
//     />
//     <path
//       d="M 58 50 V 66 M 50 58 H 66"
//       stroke="#E0E7FF"
//       stroke-width="2.5"
//       stroke-linecap="round"
//     />
//   </g>

//   <g filter="url(#element-shadow)">
//     <circle
//       cx="142"
//       cy="58"
//       r="16"
//       fill="#3730A3"
//       stroke="#4F46E5"
//       stroke-width="1.5"
//     />
//     <path
//       d="M 133 53 H 151 M 138 53 V 64 C 138 65.5 136.5 66 135 66 M 146 53 V 65 C 146 66 147 66.5 149 66"
//       stroke="url(#accent-gold)"
//       stroke-width="2"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//       fill="none"
//     />
//   </g>

//   <g filter="url(#element-shadow)">
//     <circle
//       cx="142"
//       cy="142"
//       r="16"
//       fill="#3730A3"
//       stroke="#4F46E5"
//       stroke-width="1.5"
//     />
//     <line
//       x1="134"
//       y1="138"
//       x2="150"
//       y2="138"
//       stroke="url(#accent-rose)"
//       stroke-width="2.5"
//       stroke-linecap="round"
//     />
//     <line
//       x1="134"
//       y1="146"
//       x2="150"
//       y2="146"
//       stroke="url(#accent-rose)"
//       stroke-width="2.5"
//       stroke-linecap="round"
//     />
//   </g>

//   <g filter="url(#element-shadow)">
//     <path
//       d="M 62 108 L 70 108 L 80 128 L 96 82 L 138 82"
//       stroke="url(#accent-gold)"
//       stroke-width="4"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//       fill="none"
//     />

//     <path
//       d="M 108 100 L 122 120 M 122 100 L 108 120"
//       stroke="#FFFFFF"
//       stroke-width="3"
//       stroke-linecap="round"
//     />
//   </g>

//   <circle cx="58" cy="142" r="3" fill="#38BDF8" opacity="0.8" />
//   <circle cx="100" cy="50" r="2.5" fill="#FDE047" opacity="0.8" />
// </svg>
