import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";

const monserrat = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-neutral-50  ${monserrat.className}`}
    >
      <div className="w-full md:px-20 bg-white shadow-lg min-h-screen overflow-hidden">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
