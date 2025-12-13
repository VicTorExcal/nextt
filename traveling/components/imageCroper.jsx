"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import Spinner from "./snipper";
import getCroppedImg from "../utils/cropImage";

export default function ImageCropper({
  title,
  type,
  sizeCrop,
  cropWidth,
  cropHeight,
  onFinish,
}) {
  // Estados principales
  const [queue, setQueue] = useState([]);
  const [currentSrc, setCurrentSrc] = useState(null);
  const [croppedImgs, setCroppedImgs] = useState([]);

  // Cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState(null);

  // UI
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const isProfile = type === "profile"; // PROFILE MODE

  // ========= HELPERS =========
  useEffect(() => {
    // PROFILE MODE → terminar inmediatamente
    if (isProfile && croppedImgs.length > 0) {
      uploadCroppedImages();
    }

    // MODO NORMAL → terminar cuando no haya más en cola
      if (!isProfile && croppedImgs.length > 0 && queue.length === 0) {
        uploadCroppedImages();
      }
  }, [croppedImgs, isProfile]);

  const readFile = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const loadNext = async () => {
    if (queue.length === 0) {
      setCurrentSrc(null);
      return;
    }

    const nextFile = queue[0];
    const base64 = await readFile(nextFile);

    setCurrentSrc(base64);
    setQueue((prev) => prev.slice(1));

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setPixels(null);
  };

  // ========= ACCIÓN DEL INPUT =========
  const handleFiles = async (files) => {
    const imgs = [...files].filter((f) => f.type.startsWith("image/"));

    if (imgs.length === 0) {
      setError("Solo se permiten imágenes.");
      return;
    }

    setError("");

    // PROFILE MODE → solo 1 imagen
    if (isProfile) {
      const base64 = await readFile(imgs[0]);
      setCurrentSrc(base64);
      setQueue([]);
      return;
    }

    // MODO NORMAL → varias imágenes
    setQueue((prev) => [...prev, ...imgs]);

    if (!currentSrc) {
      const base64 = await readFile(imgs[0]);
      setCurrentSrc(base64);
      setQueue((prev) => prev.slice(1));
    }
  };

  const cropComplete = useCallback((_, areaPixels) => {
    setPixels(areaPixels);
  }, []);

  // ========= RECORTAR =========
  const cropAndContinue = async () => {
    if (!currentSrc || !pixels) return;

    try {
      setLoading(true);

      const result = await getCroppedImg(
        currentSrc,
        sizeCrop,
        pixels,
        { width: cropWidth, height: cropHeight }
      );

      setCroppedImgs((prev) => [...prev, result]);
      await loadNext();

    } catch (err) {
      console.error(err);
      setError("Error al recortar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  // ========= RESET =========
  const resetAll = () => {
    setQueue([]);
    setCurrentSrc(null);
    setCroppedImgs([]);
    setPixels(null);
    setError("");
  };

  // ========= LISTO PARA DEVOLVER =========
  const uploadCroppedImages = () => {
    console.log("UPLOAD → croppedImgs:", croppedImgs.length);

    if (croppedImgs.length === 0) return;

    if (isProfile) {
      const blob = croppedImgs[0];
      const file = new File(
        [blob],
        `avatar-${Date.now()}.png`,
        { type: "image/png" }
      );

      console.log("IMAGEN ENVIADA → ", file);
      onFinish(file);   // ← ← AHORA SÍ SE EJECUTA

      console.log("typeof file:", typeof file);
      console.log("instanceof File:", file instanceof File);
      return;
    }

    // Múltiples imágenes
    const files = croppedImgs.map((blob, i) =>
      new File([blob], `img-${i}-${Date.now()}.png`, { type: "image/png" })
    );

    onFinish(files);
  };

  // ========= RENDER =========

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {title || "Sube y recorta tus imágenes"}
      </h1>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* DROPZONE → ocultar si "profile" y ya hay imagen */}
      {!currentSrc && !(isProfile && croppedImgs.length > 0) && (
        <div
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          className={`w-full h-52 border-2 rounded-lg flex items-center justify-center cursor-pointer transition ${
            dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 border-dashed"
          }`}
        >
          <label className="w-full h-full flex items-center justify-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple={!isProfile}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <p className="text-gray-500 text-center">
              Arrastra imágenes aquí o haz clic para seleccionarlas
            </p>
          </label>
        </div>
      )}

      {/* CROPPER */}
      {currentSrc && (
        <>
          <div
            className={`relative w-full bg-gray-200 overflow-hidden mx-auto ${
              isProfile ? "rounded-full h-[350px]" : "h-[350px]"
            }`}
            style={{ maxWidth: cropWidth, maxHeight: cropHeight }}
          >
            <Cropper
              image={currentSrc}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={cropComplete}
              aspect={isProfile ? 1 : (cropWidth && cropHeight ? cropWidth / cropHeight : 1)}
            />
          </div>
          
          {/* BOTONES DEL CROPPER */}
          <div className="flex gap-3 mt-4">
            {loading ? (
              <Spinner size={30} color="text-green-500" />
            ) : (
              <>
                <button
                  onClick={cropAndContinue}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {isProfile ? "Recortar" : "Recortar y continuar"}
                </button>

                <button
                  onClick={resetAll}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* PREVIEW FINAL */}
      {croppedImgs.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Imágenes recortadas:</h2>

          <div className={`grid ${isProfile ? "grid-cols-1" : "grid-cols-3"} gap-4`}>
            {croppedImgs.map((img, i) => (
              <div key={i} className="relative">
                {!isProfile && (
                  <button
                    className="absolute top-0 right-0 bg-white text-red-500 w-6 h-6 rounded-full shadow"
                    onClick={() =>
                      setCroppedImgs((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </button>
                )}

                <img
                  src={URL.createObjectURL(img)}
                  className={`w-24 h-24 object-cover border ${
                    isProfile ? "rounded-full" : ""
                  }`}
                />
              </div>
            ))}
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cambiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
