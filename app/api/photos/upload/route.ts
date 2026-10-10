import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/session";
import { jsonError } from "@/lib/api";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// Délivre un jeton d'envoi : le navigateur envoie ensuite la photo directement à Vercel Blob
export async function POST(request: Request) {
  // Token du store Blob public (le préfixe BLOB_PUBLIC vient de la connexion du store dans Vercel)
  const token = process.env.BLOB_PUBLIC_READ_WRITE_TOKEN;
  if (!token) {
    console.error("Upload photo : BLOB_PUBLIC_READ_WRITE_TOKEN n'est pas défini");
    return jsonError("Le stockage des photos n'est pas configuré.", 500);
  }

  if (!(await isLoggedIn())) return jsonError("Session expirée, reconnecte-toi.", 401);

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
        maximumSizeInBytes: MAX_PHOTO_BYTES,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload photo : échec", error);
    return jsonError(error instanceof Error ? error.message : "Envoi impossible.", 400);
  }
}
