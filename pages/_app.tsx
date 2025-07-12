import FloatingOrder from "@/components/ui/FloatingOrder";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { PaymentProvider } from "@/contex/paymentContex";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { PopupMustLogin } from "@/components/ui";

const monserrat = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [isLoggedUsingCookie, setIsLoggedUsingCookie] = useState(false);

  useEffect(() => {
    const role = nookies.get().role;
    const tableNumber = nookies.get().tableNumber;
    if (role && tableNumber) {
      setIsLoggedUsingCookie(true);
    } else {
      setIsLoggedUsingCookie(false);
    }
  }, [nookies.get().role, nookies.get().tableNumber, setIsLoggedUsingCookie]);

  return (
    <PaymentProvider>
      <FloatingOrder />
      <ToastContainer />
      <div
        className={`min-h-screen flex items-center justify-center bg-neutral-50 ${monserrat.className}`}
      >
        <PopupMustLogin isOpen={!isLoggedUsingCookie} />
        <div className="w-full bg-white shadow-lg min-h-screen">
          <Component {...pageProps} />
        </div>
      </div>
    </PaymentProvider>
  );
}
