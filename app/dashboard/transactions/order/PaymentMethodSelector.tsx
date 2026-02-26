"use client"

import { CircleDollarSign } from "lucide-react"

type Props = {
  value: string
  onChange: (method: string) => void
}

const paymentMethods = [
  {
    id: "qris",
    label: "QRIS",
    img: "/qris.png",
  },
]

export function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-sm p-3 shadow-sm border flex flex-col gap-2">
      <div className="flex items-center gap-2 text-base font-semibold">
        <CircleDollarSign className="w-6 h-6 text-white bg-primary rounded-sm p-1" />
        Select Payment Method
      </div>

      <hr className="my-1 border-gray-300 border-dashed" />

      <div className="space-y-2">
        {paymentMethods.map((method) => {
          const active = value === method.id

          return (
            <div
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                active
                  ? "border border-primary bg-primary/10"
                  : "border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <img
                    src={method.img}
                    alt={method.label}
                    className="object-contain h-full w-full"
                  />
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded-full border ${
                  active
                    ? "bg-primary border-primary"
                    : "border-gray-400"
                }`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}