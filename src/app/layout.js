import { Poppins } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
const inter = Poppins({ subsets: ["latin"], weight:'500' });

export const metadata = {
  title: "billboard Admin Dashboard",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
