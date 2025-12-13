import Image from "next/image";

const categories = [
  { id: 1, src: "/turismoCat.png", label: "Turismo", position: { left: "left-0", top: "top-1" }, justify: "start" },
  { id: 2, src: "/vuelosCat.png", label: "Vuelos", position: { left: "left-20", top: "top-1" }, justify: "center" },
  { id: 3, src: "/hosteleriaCat.png", label: "Hostelería", position: { left: "left-50", top: "top-1" }, justify: "end" },
];

function CategIcons() {
  return (
    <section className="md:w-lvh md:p-0 md:m-auto md:mt-10 md:flex-col pb-10 px-2">
      <h2 className="text-xl text-center py-2">Categorías</h2>

      <div className="relative flex justify-center">
        {/* Marco */}
        <div className="absolute z-20 pointer-events-none md:h-35 h-25">
          <Image src="/marcoCat.png" alt="Marco categorías" width={500} height={500} />
        </div>

        {/* Íconos dinámicos */}
        {categories.map((cat) => (
          <a
            key={cat.id}
            href="#"
            className={`absolute group ${cat.position.left} ${cat.position.top} md:w-80`}
          >
            <div className="relative h-23 md:h-32 transition-all duration-300 group-hover:blur-sm">
              <Image
                src={cat.src}
                alt={cat.label}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <h3
              className={`absolute inset-0 flex items-center justify-${cat.justify} text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
              {cat.label}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}

export default CategIcons;
