import Carousel from "../../components/carousel"
import Cards from "../../components/slidecard"
import CarouselItems from "../../components/carouselItems"
export default function ClientPage(){
    return<>
        <div className="pt-16">
            <Carousel />
            <Cards />
            <CarouselItems typecard="carouselcardvertical"/>
            <footer className="mt-4 px-4 pt-2 bg-gray-800/30 text-gray-500 text-sm inset-shadow-sm inset-shadow-gray-400">
                <p>@Copyright 2024</p>
                <p>Developed by <span className="font-bold">TorresDev Company SAS</span></p>
                <p>Support <span className="font-bold">support@tdcompany.com</span></p>
                <p className="text-right">v 1.0.0.1</p>
            </footer>
        </div>
    </>
}
