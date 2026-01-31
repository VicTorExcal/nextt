"use client";

import { useContext, useState, useRef, useCallback, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import Link from "next/link";
import Search from "./search";
import Modal from "./modal";
import Login from "../moduls/login";
import NewUser from "../moduls/newuser";
import DropdownButton from "./dropdownButton";
import ShoppingCart from "./shoppingCar";
import Avatar from "./avatar";
import { PiShoppingCartLight } from "react-icons/pi";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("login");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleDropdown = () => setOpenDropdown((v) => !v);
  const closeDropdown = () => setOpenDropdown(false);
  const [isLoading, setIsLoading] = useState(true);

  const cartButtonRef = useRef();

  // DATOS GENERICOS DE PRODUCTOS
  const [products] = useState([
    { name: "Camiseta", quantity: 2, price: 29.99, image: "next.svg" },
    { name: "Zapatos", quantity: 1, price: 59.99, image: "next.svg" }
  ]);

  const productCount = products.reduce((acc, item) => acc + item.quantity, 0);

  // FUNCION DETERMINAR ABRIR DROPDOWN O LOGIN
  const handleAvatarClick = (e) => {
    if (user) {
      toggleDropdown();
    } else {
      openLogin(e);
    }
  };

  const toggleCart = () => {
    if (user) setIsCartOpen((prev) => !prev);
  };

  // ABRIR MODAL LOGIN
  const openLogin = (e) => {
    if(user){  }

    e.preventDefault();
    setModalContent("login");
    setIsModalOpen(true);
  };

  // ABRIR MODAL DE REGISTRO DE USUARIO
  const openSignUp = (e) => {
    e.preventDefault();
    setModalContent("signup");
    setIsModalOpen(true);
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed z-50 bg-white shadow-xl ring-1 ring-gray-900/5 pb-2 md:p-1 w-full">
        <header className="px-2 pt-3 md:flex md:items-center md:py-1 md:gap-5 md:px-5">
          <section className="flex justify-between gap-2">
            
            {/* LOGO */}
            <Link href="/client">
              <img 
                src="/next.svg" 
                alt="Logo"
                className="sm:h-12 md:w-xl"
              />
            </Link>

            {/* BUSCADOR */}
            <div className="bg-white flex flex-col sm:flex-row sm:px-2 sm:py-1">
              <Search tableName="productos" role={user ? user.rol_usuario : "cliente"}/>
            </div>

            {/* MENÚ MÓVIL */}
            <button className="mt-1 cursor-pointer md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </section>

          {/* NAV LINKS */}
          <nav
            className={`
              ${isOpen ? "mt-8 max-h-85" : "mt-0"} 
              flex flex-col max-h-0 overflow-hidden transition-all md:max-h-full md:flex-row md:mt-0 md:w-full
            `}
          >
            {/* LINKS */}
            <ul className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:gap-3 md:py-0">
              <Link href="/client/productos" className="text-gray-600 hover:text-black md:text-xl">Productos</Link>
              <Link href="/client/ofertas" className="text-gray-600 hover:text-black md:text-xl">Ofertas</Link>
              <Link href="/client/ayuda" className="text-gray-600 hover:text-black md:text-xl">Ayuda</Link>
            </ul>

            <div className="md:absolute md:top-1.5 md:right-0">
              <div className="flex">

                {/* CARRITO */}
                <div className="md:px-4 md:py-1">
                  <button className="md:top-4.5 md:-left-16 hover:cursor-pointer" ref={cartButtonRef} onClick={user ? toggleCart : openLogin}>
                    <PiShoppingCartLight className="w-8 md:w-10 md:h-10"/>

                    {user && productCount > 0 && (
                      <span className="bg-red-800 text-xs text-white rounded-full px-1.5 relative bottom-10 left-4 md:left-3">
                        {productCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* AVATAR */}
                <Avatar user={user} onClick={handleAvatarClick} />
                
                {/* Datos del usuario */}
                <div className="px-4 text-gray-400 md:hidden">
                  {user ? (
                    <>
                      <p className="font-bold">{user.nombre_usuario}</p>
                      <span className="text-sm">{user.telefono_usuario}</span>
                    </>
                  ) : (
                    <p className="font-bold py-3">Invitado</p>
                  )}
                </div>

                {/* DROPDOWN DEL USUARIO */}
                {user && (
                  <DropdownButton
                    options={[
                      { value: "perfil", label: "Perfil" },
                      { value: "ayuda", label: "Ayuda" },
                      { value: "logout", label: "Salir", logout }
                    ]}
                    svg={
                      <svg className="w-5 relative top-3" viewBox="0 0 24 24" onClick={toggleDropdown} >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    }
                    classDropdown="relative px-2"
                    open={openDropdown}
                    onClose={closeDropdown}
                  />
                )}

                {/* LOGIN / REGISTRO */}
                {!user && (
                  <div className="flex flex-col items-end pl-4 pr-2 justify-center">
                    <button onClick={openLogin} className="text-gray-800 hover:text-sky-800 hover:cursor-pointer">
                      Iniciar Sesión
                    </button>
                    <button onClick={openSignUp} className="text-gray-800 hover:text-sky-800 text-sm hover:cursor-pointer">
                      Registrarse
                    </button>
                  </div>
                )}
              </div>
            

            </div>

          </nav>
        </header>
      </div>

      {/* CARRITO */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={products}
        cartButtonRef={cartButtonRef}
      />

      {/* MODAL LOGIN / REGISTER */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent === "login" ? (
          <Login switchToSignUp={openSignUp} />
        ) : (
          <NewUser switchToLogin={openLogin} />
        )}
      </Modal>
    </>
  );
}

export default Navbar;
