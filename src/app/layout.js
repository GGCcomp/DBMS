import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from "@/components/AuthProvider";
import FirebaseSetup from "@/components/FirebaseSetup";
import SocketProvider from "@/components/SocketProvider";
import ChatBox from "@/components/ChatBox";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Our Data Bank",
  description: "Data Bank for our website!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
          <Navbar />
        {children}
        <ChatBox/>
        <Footer />
        <FirebaseSetup />
        <ToastContainer position="bottom-right" />
        </SocketProvider>
        </AuthProvider>
        </body>
    </html>
  );
}

//copying disabled:

// import { Inter } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AuthProvider from "@/components/AuthProvider";
// import FirebaseSetup from "@/components/FirebaseSetup";
// import Script from "next/script";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Our Data Bank",
//   description: "Data Bank for our website!",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <Script
//           id="security-script"
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: `
//               // Disable Right-Click
//               document.addEventListener("contextmenu", (e) => {
//                 e.preventDefault();
//                 alert("Right-click is disabled on this website.");
//               });

//               // Disable Inspect Element (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
//               document.addEventListener("keydown", (e) => {
//                 if (
//                   (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
//                   (e.ctrlKey && e.key === "U") ||
//                   e.key === "F12"
//                 ) {
//                   e.preventDefault();
//                   alert("Inspect Element is disabled on this website.");
//                 }
//               });

//               // Prevent Copying Text
//               document.addEventListener("copy", (e) => {
//                 e.preventDefault();
//                 alert("Copying content is disabled.");
//               });

//               // Prevent Screenshots (Print Screen Key)
//               document.addEventListener("keyup", (e) => {
//                 if (e.key === "PrintScreen") {
//                   navigator.clipboard.writeText(""); // Clears clipboard
//                   alert("Screenshots are disabled on this site.");
//                 }
//               });

//               // Detect DevTools Opened (Experimental)
//               let devtoolsOpen = false;
//               setInterval(() => {
//                 const widthDiff = window.outerWidth - window.innerWidth > 160;
//                 const heightDiff = window.outerHeight - window.innerHeight > 160;
//                 if (widthDiff || heightDiff) {
//                   if (!devtoolsOpen) {
//                     alert("Developer tools detected! Please close DevTools.");
//                     devtoolsOpen = true;
//                   }
//                 } else {
//                   devtoolsOpen = false;
//                 }
//               }, 1000);
//             `,
//           }}
//         />
//         <style>{`
//           /* Disable text selection */
//           body {
//             -webkit-user-select: none;
//             -moz-user-select: none;
//             -ms-user-select: none;
//             user-select: none;
//           }
//         `}</style>
//       </head>
//       <body className={inter.className}>
//         <AuthProvider>
//           <Navbar />
//           {children}
//           <Footer />
//           <FirebaseSetup />
//           <ToastContainer position="bottom-right" />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

