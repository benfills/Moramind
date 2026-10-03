import "../index.css";

export default function Productivityicon() {
  return (
    <div className="relative">
      <svg
        viewBox="42 60 116 105"
        width="80"
        height="80"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        fill="none"
      >
        <g>
          <path
            d="M100 55c-20 0-35 12.5-37.5 30-10 5-15 17.5-10 30-5 10-2.5 22.5 7.5 30 2.5 15 15 25 30 25h20c15 0 27.5-10 30-25 10-7.5 12.5-20 7.5-30 5-12.5 0-25-10-30-2.5-17.5-17.5-30-37.5-30z"
            fill="#1F6F8B"
            stroke="#F472B6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          <path
            d="M100 60v105
               M80 75c7.5 5 7.5 15 0 20
               M120 75c-7.5 5-7.5 15 0 20
               M70 110c7.5 2.5 7.5 12.5 0 17.5
               M130 110c-7.5 2.5-7.5 12.5 0 17.5"
            stroke="#F472B6"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <svg
        viewBox="40 10 100 220"
        width="100"
        height="110"
        xmlns="http://www.w3.org/2000/svg"
        className="svgparent"
        fill="none"
      >
        <g
          stroke="#F472B6"
          strokeWidth="3.75"
          strokeLinecap="round"
          opacity="0.85"
        >
          <path id="plus1" stroke="none" d="M130 35v25M117 48h25" />
          <path id="plus2" stroke="none" d="M50 40v25M37 53h25" />
        </g>
      </svg>
    </div>
  );
}
