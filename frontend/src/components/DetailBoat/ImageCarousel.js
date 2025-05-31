import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  setCurrentImageIndex,
  nextSlide,
  prevSlide,
  setImageHovering,
} from "../../redux/action";
import { fetchYachtImages } from "../../redux/asyncActions";

function ImageCarousel({ yachtId }) {
  const dispatch = useDispatch();
  const { images, currentIndex, isHovering } = useSelector(
    (state) => state.images
  );

  useEffect(() => {
    if (yachtId) {
      dispatch(fetchYachtImages(yachtId));
    }
  }, [dispatch, yachtId]);

  useEffect(() => {
    if (!isHovering && images.length > 1) {
      const interval = setInterval(() => {
        dispatch(nextSlide());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [dispatch, isHovering, images.length]);

  const showNavigation = images.length > 1;

  return (
    <div className="w-full mt-10 overflow-hidden">
      <div className="flex px-6">
        <div className="w-1/6 relative flex items-center justify-center">
          <img
            src={images.length > 0 ? images[0].src : "./images/yacht-8.jpg"}
            alt={images.length > 0 ? images[0].alt : "Default Yacht Image"}
            className="object-cover w-full rounded-l-3xl h-[300px]"
          />
          {showNavigation && (
            <button
              onClick={() => dispatch(prevSlide())}
              className="absolute z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          )}
        </div>
        <div
          className="w-4/6 relative flex items-center justify-center"
          onMouseEnter={() => dispatch(setImageHovering(true))}
          onMouseLeave={() => dispatch(setImageHovering(false))}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full px-6 transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-[300px]"
              />
            </div>
          ))}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {images.map((thumb, index) => (
              <div
                key={index}
                onClick={() => dispatch(setCurrentImageIndex(index))}
                className={`h-16 w-16 overflow-hidden cursor-pointer border-2 rounded-xl ${
                  index === currentIndex
                    ? "border-white"
                    : "border-transparent opacity-80"
                }`}
              >
                <img
                  src={thumb.src}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full rounded-xl h-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/6 relative flex items-center justify-center">
          <img
            src={
              images.length > 1
                ? images[1].src
                : images.length > 0
                ? images[0].src
                : "./images/yacht-8.jpg"
            }
            alt={
              images.length > 1
                ? images[1].alt
                : images.length > 0
                ? images[0].alt
                : "Default Yacht Image"
            }
            className="object-cover w-full rounded-r-3xl h-[300px]"
          />
          {showNavigation && (
            <button
              onClick={() => dispatch(nextSlide())}
              className="absolute z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
