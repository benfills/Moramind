import "../index.css"

export default function Aichatboxicon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      width="100"
      height="100"
      fill="none"
    >
      <defs>
        <linearGradient
          id="aiLightGradient"
          x1="2"
          y1="3"
          x2="22"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stop-color="#4F46E5" />
          <stop offset="50%" stop-color="#7C3AED" />
          <stop offset="100%" stop-color="#DB2777" />
        </linearGradient>
      </defs>

      <path
        d="M12 3C6.477 3 2 6.955 2 11.833c0 2.656 1.332 5.03 3.424 6.666-.216 1.41-.952 2.705-2.024 3.501 2.604.148 4.981-.692 6.804-1.884.58.098 1.18.151 1.796.151 5.523 0 10-3.955 10-8.833C22 6.955 17.523 3 12 3z"
        stroke="url(#aiLightGradient)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="M10.5 7.5c0 1.657-1.343 3-3 3 1.657 0 3 1.343 3 3 0-1.657 1.343-3 3-3-1.657 0-3-1.343-3-3z"
        fill="url(#aiLightGradient)"
      />

      <path
        d="M15.5 6.5c0 1.105-.895 2-2 2 1.105 0 2 .895 2 2 0-1.105.895-2 2-2-1.105 0-2-.895-2-2z"
        fill="url(#aiLightGradient)"
      />
    </svg>
  );
}
