import "./globals.css";
export const metadata = {
  title: "SocialHub",
  description: "Simple Phase 2 project",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
