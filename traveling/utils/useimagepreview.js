"use client"; // Importante para Next.js: asegura que este hook solo se ejecute en el cliente
import { useEffect, useState } from "react";

export function useImagePreview(files) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!files || files.length === 0 || typeof window === "undefined") {
      setImages([]);
      return;
    }

    const fileArray = Array.from(files);
    const previews = fileArray.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setImages(previews);

    // Limpieza de URLs cuando el componente se desmonte o cambien archivos
    return () => {
      previews.forEach((img) => URL.revokeObjectURL(img.url));
      setImages([]);
    };
  }, [files]);

  return { images };
}
