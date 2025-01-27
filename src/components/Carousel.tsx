import React, { useState } from 'react';

interface CarouselProps {
  molecules: string[];
}

const Carousel: React.FC<CarouselProps> = ({ molecules }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % molecules.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + molecules.length) % molecules.length);
  };

  return (
    <div className="molecule-carousel">
      <button className="carousel-btn prev" onClick={handlePrev}>←</button>
      <div className="carousel-slide">{molecules[currentIndex]}</div>
      <button className="carousel-btn next" onClick={handleNext}>→</button>
    </div>
  );
};

export default Carousel;