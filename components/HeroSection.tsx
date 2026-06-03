"use client";

import { useEffect, useState } from "react";
import Container from "./Container";

export default function HeroSection({
  imgs = [],
  title = "Excellence in Trade",
  subTitle = "Since 2010",
}) {
  const images =
    imgs && imgs.length > 0
      ? imgs
      : [
        "/images/banner-3.jpg",
      ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[20vh] md:h-[20vh] w-full overflow-hidden bg-brand bg-hero-cover bg-fixed bg-no-repeat bg-right bg-cover">
      {/* Background Slider */}
      {/* <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={``}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
      </div> */}

      {/* Overlay */}
      <div className="relative z-10 flex h-full  text-white shadow-2xl px-4">
        <Container className="relative z-10 flex items-center justify-center text-center py-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold">
              <span >{title}</span>
            </h1>
            <span >{subTitle}</span>
          </div>
        </Container>
      </div>
    </div>
  );
}
