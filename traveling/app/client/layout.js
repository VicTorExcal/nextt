'use client'
import Navbar from "../../components/navbar"

export default function clientLayout({children}){
    return(
        <>  
            <Navbar />
            {children}
        </>
    )
}