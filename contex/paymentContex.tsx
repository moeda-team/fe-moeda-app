// context/PaymentContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type PaymentContextType = {
  paymentNumber: string;
  setPaymentNumber: (val: string) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  total: number;
  setTotal: (val: number) => void;
  serviceCharge: number;
  setServiceCharge: (val: number) => void;
  subTotal: number;
  setSubTotal: (val: number) => void;
  rounding: number;
  setRounding: (val: number) => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [paymentNumber, setPaymentNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [total, setTotal] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [rounding, setRounding] = useState(0);

  return (
    <PaymentContext.Provider
      value={{
        paymentNumber,
        setPaymentNumber,
        paymentMethod,
        setPaymentMethod,
        total,
        setTotal,
        rounding,
        serviceCharge,
        setServiceCharge,
        subTotal,
        setSubTotal,
        setRounding,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
