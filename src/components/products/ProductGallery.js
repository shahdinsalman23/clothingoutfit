"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export default function ProductGallery({ images, name }) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  if (total === 0) {
    return (
      <div className="shopmate-gallery-shopad">
        <div className="shopmate-stage-pdpad no-image-pdpad">
          <ImageOff size={44} />
        </div>
      </div>
    );
  }

  const go = (step) => setIndex((prev) => (prev + step + total) % total);

  return (
    <div
      className="shopmate-gallery-shopad"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div className="shopmate-stage-pdpad">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={index} src={images[index].url} alt={images[index].alt || name} />

        {total > 1 && (
          <>
            <button type="button" className="arrow-pdpad left-pdpad" onClick={() => go(-1)} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="arrow-pdpad right-pdpad" onClick={() => go(1)} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
            <span className="counter-pdpad">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="shopmate-thumbs-pdpad">
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              className={i === index ? "active-pdpad" : ""}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}