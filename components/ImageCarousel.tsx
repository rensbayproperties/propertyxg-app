"use client";
import { useState, useEffect } from "react";
import building from "@/public/assets/images/building.avif";
import outside from "@/public/assets/images/outside.avif";
import Parlour from "@/public/assets/images/interior.avif";
import bedroom from "@/public/assets/images/parlour.avif";
import dreamhouse from "@/public/assets/images/Dreamhouse.avif";
import { LeftArrowSVG, RightArrowSVG } from "./icons";
import GalleryModal from "./modal/gallerymodal";
import { Camera } from "lucide-react";

export const images = [
  { id: 1, src: building.src },
  { id: 2, src: outside.src },
  { id: 3, src: Parlour.src },
  { id: 4, src: bedroom.src },
  { id: 5, src: dreamhouse.src },
];

interface ImageCarouselProps {
  imagesData?: { id: number; src: string }[];
  variant?: "single" | "double";
}

const ImageCarousel = ({
  imagesData = images,
  variant = "single",
}: ImageCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("right");
  const [openGallery, setOpenGallery] = useState(false);

  if (!imagesData || imagesData.length === 0) {
    return (
      <div className="w-full h-[370px] bg-gray-200 flex items-center justify-center mt-5">
        No images available
      </div>
    );
  }

  const nextSlide = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % imagesData.length);
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + imagesData.length) % imagesData.length);
  };

  const currentImage = imagesData[current];
  const nextImage = imagesData[(current + 1) % imagesData.length];

  useEffect(() => {
    if (variant !== "single") return; // only run for single variant

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImage, variant]);
  return (
    <>
      {variant === "single" && (
        <div className="w-full h-full relative rounded overflow-hidden group cursor-pointer">
          {/* Background Image */}
          <div
            key={currentImage.id + current}
            className={`w-full h-full bg-center bg-cover transition-all duration-500 ${
              direction === "right"
                ? "animate-slide-left"
                : "animate-slide-right"
            }`}
            style={{
              backgroundImage: `url(${currentImage.src})`,
            }}
          />

          {/* Camera Counter */}
          <div
            onClick={() => setOpenGallery(true)}
            className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 text-white px-4 py-1 rounded-full cursor-pointer"
          >
            <Camera size={16} />
            <span>{imagesData.length}</span>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {imagesData.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? "right" : "left");
                  setCurrent(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* DOUBLE VARIANT */}
      {variant === "double" && (
        <div className="w-full h-[370px] mt-5 flex gap-2 relative">
          {/* LEFT IMAGE */}
          <div className="w-1/2 h-full rounded overflow-hidden relative group cursor-pointer">
            <img
              key={currentImage.id + current}
              src={currentImage.src}
              alt="left"
              className={`w-full h-full object-cover transition-all duration-500 ${
                direction === "right"
                  ? "animate-slide-left"
                  : "animate-slide-right"
              }`}
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300" />
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-1/2 h-full rounded overflow-hidden relative group cursor-pointer">
            <img
              key={nextImage.id + current}
              src={nextImage.src}
              alt="right"
              className={`w-full h-full object-cover transition-all duration-500 ${
                direction === "right"
                  ? "animate-slide-left"
                  : "animate-slide-right"
              }`}
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300" />

            <div
              onClick={() => setOpenGallery(true)}
              className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 text-white px-4 py-1 rounded-full cursor-pointer"
            >
              <Camera size={16} />
              <span>{imagesData.length}</span>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
          >
            <LeftArrowSVG />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
          >
            <RightArrowSVG />
          </button>
        </div>
      )}

      {/* <GalleryModal open={openGallery} setOpen={setOpenGallery} /> */}
    </>
  );
};

export default ImageCarousel;
