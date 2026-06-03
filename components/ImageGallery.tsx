'use client'
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Images } from "lucide-react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface ImageGalleryComponentProps {
  images: string[];
  style?: string;
}

const ImageGalleryComponent: React.FC<ImageGalleryComponentProps> = ({
  images,
  style,
}) => {
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <ImageGridGallery
        images={images}
        onGalleryToggle={(index) => {
          setActiveIndex(index);
          setGalleryOpen(true);
        }}
        style={style}
      />

      {isGalleryOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 z-[99999]">
          <div className="absolute inset-0 flex items-center justify-center bg-whites">
            <Swiper
              modules={[Navigation]}
              navigation
              className="w-full max-w-5xl md:h-[80vh]"
              initialSlide={activeIndex}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center">
                  <img
                    src={img}
                    alt={`slide-${idx}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <Button
              variant="link"
              onClick={() => setGalleryOpen(false)}
              className="absolute top-4 right-4 text-2xl"
              title="Close"
            >
              <i className="bi-x-lg"></i>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function ImageGridGallery({
  images,
  onGalleryToggle,
  style,
}: {
  images?: string[];
  style?: string;
  onGalleryToggle: (index: number) => void;
}) {
  if (!images || images.length === 0) return null;

  // ✅ Handle 1–4 images differently
  if (images.length < 5) {
    const gridCols = images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2";
    const gridHeight = images.length === 1 ? " h-[10rem] md:h-[30.5rem]" : images.length === 2 ? " h-[10rem] md:h-[30.5rem]" : " h-[10rem] md:h-[15rem]";

    return (
      <div className={`relative w-full grid ${gridCols} gap-1.5 rounded-lg overflow-hidden`}>
        {images.map((image, i) => (
          <div
            key={`image_${i}`}
            className={`cursor-pointer bg-gray-200 overflow-hidden relative ${gridHeight}`}
            onClick={() => onGalleryToggle(i)}
          >
            <ImageCard
              src={image}
              meta={{
                imgWidth: images.length === 1 ? 600 : 400,
                imgHeight: images.length === 1 ? 400 : 400,
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // layout for 5 or more images
  return (
    <div className="relative w-full grid grid-cols-2 md:grid-cols-4 gap-1.5 overflow-hidden rounded-xl">
      <div
        className="cursor-pointer h-[10rem] md:h-[30.5rem] bg-gray-200 md:row-span-2 md:col-span-2 overflow-hidden relative"
        onClick={() => onGalleryToggle(0)}
      >
        <ImageCard src={images[0]} meta={{ imgWidth: 600, imgHeight: 600 }} />
      </div>
      <div
        className="cursor-pointer h-[10rem] md:h-[15rem] bg-gray-200 overflow-hidden"
        onClick={() => onGalleryToggle(1)}
      >
        <ImageCard src={images[1]} meta={{ imgWidth: 400, imgHeight: 400 }} />
      </div>
      <div
        className="cursor-pointer h-[10rem] md:h-[15rem] bg-gray-200 overflow-hidden max-sm:col-span-2"
        onClick={() => onGalleryToggle(2)}
      >
        <ImageCard src={images[2]} meta={{ imgWidth: 400, imgHeight: 400 }} />
      </div>
      <div
        className="cursor-pointer h-[10rem] md:h-[15rem] bg-gray-200 overflow-hidden"
        onClick={() => onGalleryToggle(3)}
      >
        <ImageCard src={images[3]} meta={{ imgWidth: 400, imgHeight: 400 }} />
      </div>
      <div
        className="cursor-pointer h-[10rem] md:h-[15rem] bg-gray-200 overflow-hidden"
        onClick={() => onGalleryToggle(4)}
      >
        <ImageCard src={images[4]} meta={{ imgWidth: 400, imgHeight: 400 }} />
      </div>
      <Button
        onClick={() => onGalleryToggle(0)}
        className="absolute bottom-2 right-2 space-x-2"
        variant={"light"}
      >
        <Images />
        See all photos
      </Button>
    </div>
  );
}


// Assuming ImageCard is defined elsewhere
interface ImageCardProps {
  src: string;
  meta: { imgWidth: number; imgHeight: number };
}

const ImageCard: React.FC<ImageCardProps> = ({ src, meta }) => (
  <div className="h-full relative">
    <img
      src={src}
      alt=""
      width={meta.imgWidth}
      height={meta.imgHeight}
      className="w-full h-full object-cover bg-center"
    />
  </div>
);

export default ImageGalleryComponent;
