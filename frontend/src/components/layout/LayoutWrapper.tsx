'use client';

import { usePathname } from 'next/navigation';
import Layout from './Layout';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return isAdminPage ? <>{children}</> : <Layout>{children}</Layout>;
}