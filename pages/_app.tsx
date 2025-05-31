import FloatingOrder from "@/components/ui/FloatingOrder";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";

const monserrat = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <FloatingOrder />
      <ToastContainer />
      <div
        className={`min-h-screen flex items-center justify-center bg-neutral-50  ${monserrat.className}`}
      >
        <div className="w-full bg-white shadow-lg min-h-screen">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
