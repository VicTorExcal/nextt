"use client";
import { useState } from "react";
import Card from "./card";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

export default function CarouselItems({ typecard }) {
  const slides = [
    {
      id: 1,
      url: "https://aventurecolombia.com/wp-content/uploads/2021/03/Desert-de-Tatacoa-%C2%A9-tristan-quevilly.jpg",
      name: "Desierto de la Tatacoa",
      location: "Neiva Huila",
    },
    {
      id: 2,
      url: "https://media-cdn.tripadvisor.com/media/photo-s/05/c0/b5/6d/departamento-de-huila.jpg",
      name: "La Caja de Agua",
      location: "Paicol - Huila",
    },
    {
      id: 3,
      url: "https://www.colombiamascompetitiva.com/wp-content/uploads/2023/04/SAN-AGUSTIN-%EF%80%A2-Mesita-C-Parque-Arqueologico-de-San-Agustin-%EF%80%A2-03delatorrephoto.jpg",
      name: "Parque Arqueológico San Agustín",
      location: "San Agustín - Huila",
    },
    {
      id: 4,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzmBT3qAc30gL9zz_c7cv_x6Z2ts-FuQncIA&s",
      name: "Sierra Nevada de Santa Marta",
      location: "Santa Marta",
    },
    {
      id: 5,
      url: "https://aventurecolombia.com/wp-content/uploads/2021/03/Desert-de-Tatacoa-%C2%A9-tristan-quevilly.jpg",
      name: "Sierra Nevada de Santa Marta",
      location: "Santa Marta",
    },
  ];

  const [current, setCurrent] = useState(0);

  const previousSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

  if (typecard !== "carouselcardvertical") return null;

  return (
    <section className="overflow-hidden m-auto shadow-sm/50 md:w-6xl h-full">
      {/* Header */}
      <div className="flex justify-between px-2 py-1">
        <h1 className="text-lg font-semibold">Lo más vendido en --</h1>
        <a href="#" className="text-xs py-1 hidden md:block">
          Mostrar más
        </a>
      </div>

      {/* Slider */}
      <div
        className="flex flex-row gap-2 transition-transform ease-in-out duration-500"
        style={{ transform: `translateX(-${current * 40}%)` }}
      >
        {slides.map((s) => (
          <Card
            key={s.id}
            id={s.id}
            typecard="vertical"
            img={s.url}
            name={s.name}
            location={s.location}
            price="59.900"
            discount="30% OFF"
            beforeprice="95.000"
            classtitle="text-xs md:text-xs/4"
            classimg="max-h-33"
            classwcard="md:max-w-35 h-62"
            classdescription="text-medium-small md:text-medium-small/4"
            classprice="text-md md:text-md"
            classtextsmall="text-xs md:text-small"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between px-2 mt-2">
        <button
          onClick={previousSlide}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:text-sky-800"
          aria-label="Anterior"
        >
          <FaLongArrowAltLeft />
        </button>
        <button
          onClick={nextSlide}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:text-sky-800"
          aria-label="Siguiente"
        >
          <FaLongArrowAltRight />
        </button>
      </div>
    </section>
  );
}
