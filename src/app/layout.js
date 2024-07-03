import { Poppins } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const inter = Poppins({ subsets: ["latin"], weight:'500' });

export const metadata = {
  title: "billboard Admin Dashboard",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}> 
       
        {children} 
        
          </body>
    </html>
   </ClerkProvider>
  );
}
