import "../index.css";

export default function Productivityicon() {
  return (
    <div className="relative">
      <svg
        viewBox="50 50 100 125"
        width="100"
        height="100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <g>
          <path
            d="M100 55c-20 0-35 12.5-37.5 30-10 5-15 17.5-10 30-5 10-2.5 22.5 7.5 30 2.5 15 15 25 30 25h20c15 0 27.5-10 30-25 10-7.5 12.5-20 7.5-30 5-12.5 0-25-10-30-2.5-17.5-17.5-30-37.5-30z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinejoin="round"
          />
          <path
            d="M100 60v105M80 75c7.5 5 7.5 15 0 20M120 75c-7.5 5-7.5 15 0 20M70 110c7.5 2.5 7.5 12.5 0 17.5M130 110c-7.5 2.5-7.5 12.5 0 17.5"
            stroke="#FFFFFF"
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
      >
        <g strokeWidth="3.75  " strokeLinecap="round" opacity="0.85">
          <path id="plus1" stroke="none" d="M130 35v25M117 48h25" />
          <path id="plus2" stroke="none" d="M50 40v25M37 53h25" />
        </g>
      </svg>
    </div>
  );
}
