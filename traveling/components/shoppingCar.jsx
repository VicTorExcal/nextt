import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ShoppingCart({
  isOpen = false,
  onClose,
  products = [],
  cartButtonRef = null,
}) {
  const cartRef = useRef();
  const [haveItems, setHaveItems] = useState(false);

  // Cerrar carrito si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideCart =
        cartRef.current && !cartRef.current.contains(event.target);
      const clickedOutsideButton =
        cartButtonRef?.current && !cartButtonRef.current.contains(event.target);

      if (isOpen && clickedOutsideCart && clickedOutsideButton) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, cartButtonRef]);

  useEffect(() => {
    setHaveItems(products.length > 0);
  }, [products]);

  return (
    <aside
      ref={cartRef}
      className={`
        fixed top-16 right-0 h-134 w-80 z-50 
        bg-white shadow-lg transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        flex flex-col
      `}
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Mi carrito</h2>
        <button
          className="text-gray-600 hover:text-black"
          onClick={onClose}
          aria-label="Cerrar carrito"
        >
          ✕
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-4 relative">
        {!haveItems ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No hay productos agregados
          </div>
        ) : (
          <ul className="space-y-4">
            {products.map((product, index) => (
              <li key={index} className="flex items-center gap-4">
                {product.image ? (
                  <div className="w-12 h-12 relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded" />
                )}

                <div className="flex flex-col">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-600">
                    Cantidad: {product.quantity}
                  </span>
                  <span className="text-sm text-gray-800 font-semibold">
                    ${product.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer / Comprar */}
      <div className="p-4 border-t">
        <button
          className={`
            w-full py-2 bg-sky-600 text-white rounded-md transition
            ${!haveItems ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-700"}
          `}
          disabled={!haveItems}
        >
          Comprar
        </button>
      </div>
    </aside>
  );
}
