import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lovable AI Clone',
  description: 'Prompt to app generator using Claude.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
