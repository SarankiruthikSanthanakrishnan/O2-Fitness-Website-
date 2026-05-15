import React, { useState, useRef } from "react";

const ImageZoom = ({ src, alt, zoom = 2 }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className="relative w-full max-h-[450px] overflow-hidden rounded-lg shadow-md border bg-white"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
    >
      {/* Main Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-contain transition-transform duration-300 ${
          isZooming ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Zoom Layer */}
      {isZooming && (
        <div
          className="absolute inset-0 bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition,
            cursor: "zoom-in",
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
