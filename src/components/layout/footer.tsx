import Image from "next/image";
import React from "react";

export default function footer() {
  return (
    <div className="flex justify-center md:justify-between md:gap-8 py-2">
      <div className="my-auto hidden md:inline leading-5">
        Copyright © 2023 Legistal DPT Integration System | All RIghts Reserved
      </div>
      <div className="flex gap-2 font-bold justify-center items-center">
        <div className="leading-4">Powered By: </div>
        <div>
          <Image
            src="/pt-hadin-ite-solution.png"
            alt="hadin"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
}
