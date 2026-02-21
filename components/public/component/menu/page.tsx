import Image from "next/image"
import { Menuitem } from "@/lib/api/menu/req-api"
import { AddMenuDrawer } from "../drawer/AddMenu"
import { TicketPercent } from "lucide-react"

interface CardMenuProps {
  data: Menuitem[]
}

export function CardMenu({ data }: CardMenuProps) {

  return (
    <div className="grid grid-cols-2 gap-4">
      {data.map((item) => (
        <div key={item.id} className="bg-card rounded-xl shadow-soft overflow-hidden p-3 flex flex-col space-y-1 justify-between relative">
          <div className="relative">
            <Image
              src={item.img}
              alt={item.name}
              width={160}
              height={160}
              className="object-cover rounded-sm"
            />
            
            {item.vouchers.length > 0 && (
              <div className="absolute top-1 left-1 bg-green-100/90 text-[10px] px-2 py-1 rounded-sm text-green-900 flex items-center">
                <TicketPercent size={15}/>
                {item.vouchers[0].voucher.type === "fixed" ? (
                  <div className="text-[10px] ml-1">Rp.{item.vouchers[0].voucher.discount.toLocaleString()}</div>
                ) : (
                  <div className="text-[10px] ml-1">{item.vouchers[0].voucher.discount}%</div>
                )}
              </div>
            )}
          </div>
          
          {/* label promo */}
          <div className="flex items-center justify-between">
            {item.vouchers.length > 0 && (
              <div className="bg-[#E35336] text-[10px] px-2 py-0.5 rounded-sm text-white">{item.vouchers[0].voucher.name}</div>
            )}
          </div>
          
          {/* price */}
          <div className="">
            <p className="text-lg font-medium line-clamp-1">
              {item.name}
            </p>

            {item.vouchers.length > 0 && item.vouchers[0].voucher.type === "fixed" && (
              <div className="flex items-start justify-between gap-2">
                <p className={item.vouchers[0].voucher.type === "fixed" ? "text-xs font-semibold line-through text-[#E35336]" : "text-xs font-semibold"}>
                  Rp {item.price.toLocaleString()}
                </p>
                
                {item.vouchers[0].voucher.type === "fixed" && (
                  <p className="text-xs font-semibold ">
                    Rp. {(Number(item.price) - Number(item.vouchers[0].voucher.discount)).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {item.vouchers.length > 0 && item.vouchers[0].voucher.type === "percent" && (
              <div className="flex items-start justify-between gap-2">
                <p className={item.vouchers[0].voucher.type === "percent" ? "text-xs font-semibold line-through text-[#E35336]" : "text-xs font-semibold"}>
                  Rp {item.price.toLocaleString()}
                </p>
                
                {item.vouchers[0].voucher.type === "percent" && (
                  <p className="text-xs font-semibold ">
                    Rp. {(Number(item.price) - (Number(item.price) * Number(item.vouchers[0].voucher.discount) / 100)).toLocaleString()}
                  </p>
                )}
              </div>
            )}
            {
              item.vouchers.length === 0 && (
                <p className="text-xs font-semibold text-[#E35336]">
                  Rp. {item.price.toLocaleString()}
                </p>
              )
            }
          </div>
          
          <AddMenuDrawer menu={item} />
        </div>
      ))}
    </div>
  )
}
