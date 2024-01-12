import React, { useEffect, useRef } from "react";

interface progressBarProps {
  handle: Function;
  state?: boolean;
  value?: number;
}

export default function ProgressBar({
  handle,
  state,
  value,
}: progressBarProps) {
  const progressBarRef = useRef(null);
  if (value === 100) {
    handle(false);
  }

  return (
    <>
      {state && (
        <>
          <div
            className="progressbarWrapper my-2"
            style={{
              width: "100%",
              backgroundColor: "rgb(209, 209, 209)",
              borderRadius: "10px",
              height: "10px",
              overflow: "hidden",
            }}
          >
            <span
              id="progressBar"
              ref={progressBarRef}
              className="mb-5"
              style={{
                width: `${value}%`,
                backgroundColor: "rgb(61, 150, 219)",
                display: "block",
                height: "100%",
              }}
            ></span>
          </div>
          {value}%
        </>
      )}
    </>
  );
}
