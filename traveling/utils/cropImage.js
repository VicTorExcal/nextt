export default function getCroppedImg(imageSrc, cropSize, pixelCrop, outputSize) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous"; // si es URL externa

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outputSize?.width || pixelCrop.width;
      canvas.height = outputSize?.height || pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No se pudo obtener contexto del canvas");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("No se pudo generar el blob");
          resolve(blob);
        },
        "image/png",
        1
      );
    };

    image.onerror = () => {
      reject("Error cargando la imagen");
    };
  });
}
