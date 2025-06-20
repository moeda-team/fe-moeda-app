import FloatingOrder from "@/components/ui/FloatingOrder";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { PaymentProvider } from "@/contex/paymentContex";
import { useRouter } from "next/router";
import { useEffect } from "react";
import nookies from "nookies";

const monserrat = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { tableNumber, role } = router.query as {
    tableNumber?: string;
    role?: string;
  };

  // useEffect(() => {
  //   if (router.isReady)
  //     if (
  //       tableNumber &&
  //       ["customer", "cashier", "barista"].includes(role as string)
  //     ) {
  //       nookies.set(null, "tableNumber", tableNumber.toString());
  //       nookies.set(null, "role", (role as string).toString());
  //       router.replace("/");
  //     }
  // }, [tableNumber, role, router]);

  return (
    <PaymentProvider>
      <FloatingOrder />
      <ToastContainer />
      <div
        className={`min-h-screen flex items-center justify-center bg-neutral-50 ${monserrat.className}`}
      >
        <div className="w-full bg-white shadow-lg min-h-screen">
          <Component {...pageProps} />
        </div>
      </div>
    </PaymentProvider>
  );
}
