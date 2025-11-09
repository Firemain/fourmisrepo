export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AuthProvider est déjà dans le layout racine
  return children;
}
