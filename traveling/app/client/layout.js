import { AuthProvider } from '../../context/authContext'
import Navbar  from "../../components/navbar";

export default function clientLayout({children}){
    return(
        <>
        <AuthProvider>
            <Navbar />
            {children}
        </AuthProvider>
        </>
    )
}