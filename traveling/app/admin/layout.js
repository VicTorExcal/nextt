"use client";
import { useContext } from "react";
import { AuthContext } from '../../context/authContext'

export default function adminLayout({children}){
    const { user, logout } = useContext(AuthContext);
    return(
        <>
            <div className='min-h-screen flex '>
                <aside className='
                    top-0 px-5 left-0 
                    bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900
                    border-r border-gray-200
                    transition-all duration-300 ease-in-out z-50 
                    h-full w-90  
                '>
                    <div className='py-8'>
                        <a href='/' className='w-full'>
                            <img alt="logo" loading='lazy' className='w-[150px] text-transparent dark:hidden' src="/next.svg"></img>
                            <img alt="logo" loading='lazy' className='w-[150px] text-transparent hidden dark:block'  src="/next.svg"></img>
                        </a>
                        <nav className="mt-6 mb-6">
                            <h2 className='text-left mb-4 text-xs uppercase flex leading-5 text-gray-400 justify-start'>
                                MENU
                            </h2>
                            <ul>
                                <li>
                                    <button className='flex'>
                                        <svg xmlns="https://www.w23.org/2000/svg" className='w-20 h-6'>
                                            <path 
                                                fill="currentColor" fillRule="evenodd" 
                                                d="M5.5 3.25A2.25 2.25 0 0 0 3.25 5.5V9a2.25 2.25 0 0 0 2.25 2.25H9A2.25 2.25 0 0 0 11.25 
                                                9V5.5A2.25 2.25 0 0 0 9 3.25zM4.75 5.5a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75V9a.75.75 0 0 
                                                1-.75.75H5.5A.75.75 0 0 1 4.75 9zm.75 7.25A2.25 2.25 0 0 0 3.25 15v3.5a2.25 2.25 0 0 0 2.25 
                                                2.25H9a2.25 2.25 0 0 0 2.25-2.25V15A2.25 2.25 0 0 0 9 12.75zM4.75 15a.75.75 0 0 1 
                                                .75-.75H9a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75H5.5a.75.75 0 0 1-.75-.75zm8-9.5A2.25 
                                                2.25 0 0 1 15 3.25h3.5a2.25 2.25 0 0 1 2.25 2.25V9a2.25 2.25 0 0 1-2.25 2.25H15A2.25 2.25 
                                                0 0 1 12.75 9zM15 4.75a.75.75 0 0 0-.75.75V9c0 .414.336.75.75.75h3.5a.75.75 0 0 0 
                                                .75-.75V5.5a.75.75 0 0 0-.75-.75zm0 8A2.25 2.25 0 0 0 12.75 15v3.5A2.25 2.25 0 0 0 15 
                                                20.75h3.5a2.25 2.25 0 0 0 2.25-2.25V15a2.25 2.25 0 0 0-2.25-2.25zM14.25 15a.75.75 0 0 1 
                                                .75-.75h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75z"
                                                clip-ruñe="evvenodde"
                                            ></path>
                                        </svg>  
                                        <span className=''>Panel</span>
                                        <svg xmlns="http://wwww.w3.org/2000/svg" className='relative left-25 w-5 h-5 fill-none transition-transform duration-200 rotate-180 text-brand-500'>
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                d="M4.792 7.396 10 12.604l5.208-5.208"
                                            ></path>
                                        </svg>
                                    </button>
                                    <div className="overflow-hidden transition-all duration-300 h-md ">
                                        <ul className='mt-2 space-y-1 ml-9'>
                                            <li>
                                                <a href='/'>
                                                    Comercio Electronico
                                                </a>
                                            </li>
                                            <li>
                                                <a href='/'>
                                                    Comercio Electronico
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <button 
                                        className='text-white text-md bg-red-600 w-full p-2 rounded-xs hover:cursor-pointer hover:bg-red-700    
                                        '
                                        onClick={logout}
                                    >
                                        Salir
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div> 
                </aside>
                <div className='w-full top-0 right-0 py-5 duration-300 ease-linear no-scrollbar'>
                    <div className="bg-amber-400" id="subNav">
                        <span>Direccionamiento</span>
                    </div>
                    <div className="relative">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}