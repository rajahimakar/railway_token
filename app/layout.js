import './globals.css';

export const metadata = {
  title: 'Parking Token Live',
  description: 'Live parking token dashboard built for demo-to-live migration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
