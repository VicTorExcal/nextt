"use client";

import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      id: 1,
      url: "https://i.pinimg.com/originals/51/82/ac/5182ac536727d576c78a9320ac62de30.jpg",
    },
    {
      id: 2,
      url: "https://wallpapercave.com/wp/wp3386769.jpg",
    },
    {
      id: 3,
      url: "https://wallpaperaccess.com/full/809523.jpg",
    },
    {
      id: 4,
      url: "https://getwallpapers.com/wallpaper/full/5/c/0/606489.jpg",
    },
  ];

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const autoplay = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [current]);

  return (
    <div
      className="
        relative
        w-85
        m-auto my-3
        shadow-xl/20
        rounded-md
        overflow-hidden
        md:w-full md:h-110
        md:rounded-none
        md:m-0
      "
    >
      {/* SLIDES */}
      <div
        className="flex transition ease-in-out duration-1000"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((s) => (
          <img
            key={s.id}
            src={s.url}
            alt={`Slide ${s.id}`}
            className="w-full h-full object-cover"
          />
        ))}
      </div>

      {/* BUTTONS */}
      <div
        className="
          text-white
          w-full
          flex
          absolute 
          top-0 
          h-50 
          justify-between 
          items-center   
          md:h-full
        "
      >
        <button
          onClick={previousSlide}
          className="
            h-full w-15 
            hover:bg-gray-400/70 
            hover:duration-200
          "
        >
          <FaAngleLeft className="w-8 h-8 mx-auto" />
        </button>

        <button
          onClick={nextSlide}
          className="
            h-full w-15 
            hover:bg-gray-400/70 
            hover:duration-200
          "
        >
          <FaAngleRight className="w-8 h-8 mx-auto" />
        </button>
      </div>

      {/* INDICATORS */}
      <div
        className="
          w-full 
          p-3
          flex 
          absolute 
          top-0 
          justify-center 
          gap-2
        "
      >
        {slides.map((_, i) => (
          <div
            key={"circle" + i}
            onClick={() => setCurrent(i)}
            className={`
              rounded-full w-1.5 h-1.5 cursor-pointer 
              ${i === current ? "bg-white" : "bg-gray-500"}
            `}
          ></div>
        ))}
      </div>
    </div>
  );
}
