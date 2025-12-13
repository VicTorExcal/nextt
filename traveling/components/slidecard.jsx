"use client"; 
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function SlideCard() {
  const slides = [
    {
      id: 1,
      url: "https://aventurecolombia.com/wp-content/uploads/2021/03/Desert-de-Tatacoa-%C2%A9-tristan-quevilly.jpg",
      name: "Desierto de la Tatacoa",
      location: "Neiva Huila",
      price: 43000,
      discount: "10%",
      beforePrice: 48000,
    },
    {
      id: 2,
      url: "https://media-cdn.tripadvisor.com/media/photo-s/05/c0/b5/6d/departamento-de-huila.jpg",
      name: "La Caja de Agua",
      location: "Paicol - Huila",
      price: 43000,
      discount: "10%",
      beforePrice: 48000,
    },
    {
      id: 3,
      url: "https://www.colombiamascompetitiva.com/wp-content/uploads/2023/04/SAN-AGUSTIN-%EF%80%A2-Mesita-C-Parque-Arqueologico-de-San-Agustin-%EF%80%A2-03delatorrephoto.jpg",
      name: "Parque Arqueológico San Agustín",
      location: "San Agustín - Huila",
      price: 43000,
      discount: "10%",
      beforePrice: 48000,
    },
    {
      id: 4,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzmBT3qAc30gL9zz_c7cv_x6Z2ts-FuQncIA&s",
      name: "Sierra Nevada de Santa Marta",
      location: "Santa Marta",
      price: 43000,
      discount: "10%",
      beforePrice: 48000,
    },
  ];

  const sliderRef = useRef(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;

    const scrollSlider = () => {
      if (!isPaused.current) {
        scrollAmount += 0.5;
        slider.scrollLeft = scrollAmount;

        if (scrollAmount >= slider.scrollWidth / 2) {
          scrollAmount = 0;
        }
      }

      requestAnimationFrame(scrollSlider);
    };

    scrollSlider();
  }, []);

  const duplicatedSlides = [...slides, ...slides];

  return (
    <section
      ref={sliderRef}
      className="
        relative overflow-hidden max-w-3xl h-70 z-10 m-auto flex gap-2.5 p-1 mb-10
        md:h-70 md:-top-20
      "
      style={{ willChange: "transform" }}
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
    >
      {duplicatedSlides.map((slide, index) => (
        <div
          key={`${slide.id}-${index}`}
          className="
            p-1 min-w-40.5 h-full shadow-lg/20 bg-amber-100
            md:min-w-50 md:min-h-40
          "
        >
          <div className="relative w-full h-32 md:h-35 pb-2 mb-1 border-b border-amber-600/30">
            <Image
              src={slide.url}
              alt={slide.name}
              fill
              sizes="100px"
              className="object-cover rounded"
              priority
              unoptimized={slide.url.includes('gstatic.com')}
            />
          </div>
          <div className="px-1.5">
            <p className="text-sm h-10 mb-1 md:text-sm">{slide.name}</p>
            <p className="text-xs text-gray-600">{slide.location}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-medium">${Number(slide.price).toLocaleString("es-ES")}</span>
              <span className="text-xs uppercase rounded">{slide.discount} de descuento</span>
            </div>
            <p className="line-through text-xs text-gray-500 mt-1">
              Antes ${Number(slide.beforePrice).toLocaleString("es-ES")}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
