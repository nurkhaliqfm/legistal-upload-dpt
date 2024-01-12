import dayjs from "dayjs";
import React from "react";

export default function header() {
  return (
    <header className="Header h-16 flex flex-col md:flex-row justify-between bg-color_2 text-white py-2 mb-4 px-6 rounded-xl">
      <div className="my-auto flex justify-start items-center gap-2 font-bold">
        <div className="md:text-[1.2rem] leading-4 md:leading-5 text-black">
          <span className="hidden sm:inline">Legistal - </span>
          <span>DPT Integration System</span>
        </div>
      </div>
      <div className="my-auto font-bold md:text-[1.2rem] md:inline hidden leading-5 text-black">
        {dayjs(new Date()).format("dddd, DD MMMM YYYY, HH:mm A")}
      </div>
    </header>
  );
}
