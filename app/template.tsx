// Re-monté à chaque navigation : donne un léger fondu d'entrée à chaque page
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
