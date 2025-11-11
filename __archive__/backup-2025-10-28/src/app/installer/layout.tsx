import { ReactNode } from 'react';

export default function InstallerLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Installer pages have their own headers and navigation
  // No main site header or topbar should be rendered
  return <>{children}</>;
}
