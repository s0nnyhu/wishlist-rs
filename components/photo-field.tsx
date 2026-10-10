"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadPhoto } from "@/lib/actions";

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

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  if (!blob) throw new Error("Conversion impossible");
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}

export function PhotoField({ initialUrl }: { initialUrl?: string | null }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const resized = await resizeToJpeg(file);
      const formData = new FormData();
      formData.append("photo", resized);
      setPhotoUrl(await uploadPhoto(formData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="mb-3.5">
      <div className="mb-1.5 text-[13px] font-semibold text-body">
        Photo <span className="font-normal text-muted">(facultatif)</span>
      </div>
      <input type="hidden" name="photoUrl" value={photoUrl ?? ""} />

      {photoUrl ? (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5">
          <Image
            src={photoUrl}
            alt="Photo de l'envie"
            width={72}
            height={72}
            className="size-[72px] shrink-0 rounded-xl object-cover"
          />
          <label className="flex-1 cursor-pointer text-[15px] font-semibold text-accent">
            Changer la photo
            <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
          </label>
          <button
            type="button"
            onClick={() => setPhotoUrl(null)}
            aria-label="Retirer la photo"
            className="flex size-9 items-center justify-center rounded-full bg-blush text-lg text-plum"
          >
            ×
          </button>
        </div>
      ) : (
        <label
          className={`flex h-[72px] w-full cursor-pointer items-center gap-3 rounded-xl border border-dashed border-accent px-3.5 text-[15px] font-semibold text-accent ${
            uploading ? "opacity-60" : ""
          }`}
        >
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-blush text-[22px] text-plum"
          >
            +
          </span>
          {uploading ? "Envoi en cours…" : "Ajouter une photo"}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFile}
            className="sr-only"
          />
        </label>
      )}

      {error && <p className="mt-1.5 text-sm text-accent">{error}</p>}
    </div>
  );
}
