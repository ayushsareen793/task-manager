import "./globals.css";

export const metadata = {
  title: "Task Manager",
  description: "Mini Task Management App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
