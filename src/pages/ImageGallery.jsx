import React, { useState } from 'react';
import { X } from 'lucide-react';

const ImageGallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageError, setImageError] = useState({});

    const images = [
        {
            id: 1,
            src: "/image/roof.png",
        },
        {
            id: 2,
            src: "/image/roof-1.png",
        },
        {
            id: 3,
            src: "/image/fr-yard.png",
        },
        {
            id: 4,
            src: "/image/ktc-02.png",
        },
        {
            id: 5,
            src: "/image/508424971_10050371961748328_142883179569101556_n.jpg",
        },
        {
            id: 6,
            src: "/image/640x480.webp",
        },
        {
            id: 7,
            src: "/image/imag.png",
        },
        {
            id: 8,
            src: "/image/img.png", 
        },
        {
            id: 9,
            src: "/image/Untitled.jpeg",
        },
        {
            id: 10,
            src: "/image/486079978_641329058828859_1512748094325556860_n.jpg",
        },
    ];

    const handleImageError = (imageId) => {
        setImageError(prev => ({
            ...prev,
            [imageId]: true
        }));
    };

    const handleKeyPress = (e, image) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setSelectedImage(image);
        }
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    React.useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (selectedImage) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [selectedImage]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-100"
                        onClick={() => !imageError[image.id] && setSelectedImage(image)}
                        onKeyDown={(e) => handleKeyPress(e, image)}
                        tabIndex={0}
                        role="button"

                    >
                        {!imageError[image.id] ? (
                            <>
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={() => handleImageError(image.id)}
                                />
                                {/* <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-3">
                  <p className="text-white text-lg font-semibold text-center">
                    {image.title}
                  </p>
                </div> */}
                            </>
                        ) : (
                            <div className="w-full h-64 flex items-center justify-center text-gray-500">
                                Image not available
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                    role="dialog"
                    aria-label={`${selectedImage.title} modal`}
                >
                    <div
                        className="relative max-w-4xl w-full"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
                            aria-label="Close modal"
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="w-full h-auto rounded-lg"
                            onError={() => handleImageError(selectedImage.id)}
                        />
                        <p className="text-white text-center mt-4 text-xl font-semibold">
                            {selectedImage.title}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;