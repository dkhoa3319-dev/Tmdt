import React from 'react';
export const metadata = {
  title: 'CASE STUDIO — Ốp Lưng Điện Thoại, iPad & Tự Thiết Kế 2D/3D',
  description: 'Website thương mại điện tử CASE STUDIO'
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>;
}
