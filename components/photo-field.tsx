"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

const MAX_SIDE = 1200;

// Réduit la photo côté navigateur pour rester léger (la limite d'upload est de 5 Mo)
async function resizeToJpeg(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error("Conversion impossible");
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}

export function PhotoField({ initialUrl }: { initialUrl?: string | null }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialUrl ?? null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const guardRef = useRef<HTMLInputElement>(null);

  // Empêche d'enregistrer le formulaire tant que la photo n'est pas envoyée
  useEffect(() => {
    guardRef.current?.setCustomValidity(uploading ? "Attends la fin de l'envoi de la photo" : "");
  }, [uploading]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setUploading(true);
    let localPreview: string | null = null;
    try {
      const resized = await resizeToJpeg(file);
      localPreview = URL.createObjectURL(resized);
      setPreview(localPreview);

      // Envoi direct du navigateur vers Vercel Blob, avec un jeton délivré par notre API
      const blob = await upload("wishes/photo.jpg", resized, {
        access: "public",
        contentType: "image/jpeg",
        handleUploadUrl: "/api/photos/upload",
      });
      setPhotoUrl(blob.url);
      setPreview(blob.url);
    } catch (err) {
      console.error(err);
      setPreview(photoUrl);
      const detail = err instanceof Error && err.message ? ` (${err.message})` : "";
      setError(`L'envoi de la photo a échoué${detail}. Réessaie dans un instant.`);
    } finally {
      setUploading(false);
      if (localPreview) setTimeout(() => URL.revokeObjectURL(localPreview!), 60_000);
    }
  }

  function removePhoto() {
    setPhotoUrl(null);
    setPreview(null);
    setError(null);
  }

  return (
    <div className="mb-3.5">
      <div className="mb-1.5 text-[13px] font-semibold text-body">
        Photo <span className="font-normal text-muted">(facultatif)</span>
      </div>
      <input type="hidden" name="photoUrl" value={photoUrl ?? ""} />
      <input ref={guardRef} aria-hidden="true" tabIndex={-1} className="sr-only" defaultValue="" />

      {preview ? (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5">
          <div className="relative size-[72px] shrink-0">
            <Image
              src={preview}
              alt="Photo de l'envie"
              width={72}
              height={72}
              unoptimized
              className={`size-[72px] rounded-xl bg-blush object-cover transition-opacity ${uploading ? "opacity-50" : ""}`}
            />
            {uploading && (
              <span
                aria-hidden="true"
                className="absolute inset-0 m-auto size-6 animate-spin rounded-full border-2 border-plum border-t-transparent"
              />
            )}
          </div>
          <label className="press flex-1 cursor-pointer text-[15px] font-semibold text-accent">
            {uploading ? "Envoi en cours…" : "Changer la photo"}
            <input type="file" accept="image/*" disabled={uploading} onChange={handleFile} className="sr-only" />
          </label>
          <button
            type="button"
            onClick={removePhoto}
            disabled={uploading}
            aria-label="Retirer la photo"
            className="press flex size-9 items-center justify-center rounded-full bg-blush text-lg text-plum disabled:opacity-50"
          >
            ×
          </button>
        </div>
      ) : (
        <label className="press flex h-[72px] w-full cursor-pointer items-center gap-3 rounded-xl border border-dashed border-accent px-3.5 text-[15px] font-semibold text-accent">
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-blush text-[22px] text-plum"
          >
            +
          </span>
          Ajouter une photo
          <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
        </label>
      )}

      {error && <p className="mt-1.5 text-sm text-accent">{error}</p>}
    </div>
  );
}
