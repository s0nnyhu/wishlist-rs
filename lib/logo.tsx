// Logo de l'app : boîte cadeau crème au ruban rose sur fond prune.
// Rendu en PNG par next/og (icônes de l'onglet, de l'écran d'accueil iPhone et du manifeste).
export const LOGO_BACKGROUND = "#5c0f2b";

export function LogoMark({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: LOGO_BACKGROUND,
      }}
    >
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 100 100">
        {/* Nœud */}
        <path d="M50 30 C42 14 24 16 28 27 C31 34 42 33 50 30 Z" fill="#e8a3b8" />
        <path d="M50 30 C58 14 76 16 72 27 C69 34 58 33 50 30 Z" fill="#e8a3b8" />
        {/* Couvercle et boîte */}
        <rect x="14" y="31" width="72" height="17" rx="4" fill="#fbf1f4" />
        <rect x="20" y="50" width="60" height="38" rx="4" fill="#fbf1f4" />
        {/* Ruban */}
        <rect x="45" y="31" width="10" height="57" fill="#e8a3b8" />
      </svg>
    </div>
  );
}
