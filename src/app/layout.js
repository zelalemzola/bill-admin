import { Poppins } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import '@mantine/tiptap/styles.css';
import { MantineProvider } from "@mantine/core";
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
       <MantineProvider>
        {children} 
         </MantineProvider>
          </body>
    </html>
   
   </ClerkProvider>
  );
}
