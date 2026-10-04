import "../index.css";

export default function Journalicon() {
  return (
    <svg
      viewBox="10 105 340 330"
      width="80"
      height="80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0 20)" stroke="#f472b6">
        <rect x="60" y="80" width="260" height="340" rx="8" fill="#1f6f8b" />
        <rect x="80" y="100" width="220" height="300" rx="4" fill="none" />
      </g>
      <g transform="matrix(.5 0 0 .5 50 150)" fill="#1f6f8b" stroke="#f472b6">
        <ellipse cx="280" cy="250" rx="150" ry="200" />
        <ellipse cx="280" cy="250" rx="125" ry="175" />
        <g transform="translate(0 -50)">
          <circle cx="280" cy="185" r="38" />
          <path d="M245 225q-25 20-45 50-25 40-25 125h210q0-85-25-125-20-30-45-50Z" />
          <path d="M280 290c-15-20-45-15-45 10s25 45 45 60c20-15 45-35 45-60s-30-30-45-10Z" />
        </g>
      </g>
      <g transform="rotate(-25 870.704 -31.759)" stroke="#f472b6">
        <rect x="-12" y="-90" width="24" height="120" rx="5" fill="#1f6f8b" />
        <rect x="-12" y="-110" width="24" height="20" rx="4" fill="#1f6f8b" />
        <path d="M12-85h10v45H12" fill="#1f6f8b" />
        <path d="M-12-55h24" />
        <path d="M-12 30h24L0 65Z" fill="#1f6f8b" />
        <path d="M0 40v20" />
      </g>
    </svg>
  );
}
