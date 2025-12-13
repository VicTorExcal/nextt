import Carousel from "../../components/carousel"
import Cards from "../../components/slidecard"
import CarouselItems from "../../components/carouselItems"
export default function ClientPage(){
    return<>
        <div className="pt-16">
            <Carousel />
            <Cards />
            <CarouselItems typecard="carouselcardvertical"/>
        </div>
    </>
}