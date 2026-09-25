import './globals.css';

export const metadata = {
  title: 'Railway Token Live',
  description: 'Live railway token dashboard built for demo-to-live migration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
