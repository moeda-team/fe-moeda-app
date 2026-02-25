import Image from "next/image"
import { Menuitem } from "@/lib/api/menu/req-api"
import { AddMenuDrawer } from "../drawer/AddMenu"
import { TicketPercent } from "lucide-react"

interface CardMenuProps {
  data: Menuitem[]
}

export function CardMenu({ data }: CardMenuProps) {

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <div key={item.id} className="bg-card rounded-xl shadow-soft overflow-hidden p-3 flex flex-col space-y-1 justify-between relative">
          <div className="relative h-32 w-full">
            <Image
              src={item.img}
              alt={item.name}
              fill
              className="object-cover object-top rounded-sm"
            />
            
            {item.discountMenus.length > 0 && (
              <div className="absolute top-1 left-1 bg-green-100/90 text-[10px] px-2 py-1 rounded-sm text-green-900 flex items-center">
                <TicketPercent size={15}/>
                {item.discountMenus[0].discount.type === "fixed" ? (
                  <div className="text-[10px] ml-1">Rp.{item.discountMenus[0].discount.discount.toLocaleString()}</div>
                ) : (
                  <div className="text-[10px] ml-1">{item.discountMenus[0].discount.discount}%</div>
                )}
              </div>
            )}
          </div>
          
          {/* price */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col mt-1">
              <div className="flex items-center justify-between">
                {item.discountMenus.length > 0 && (
                  <div className="bg-[#E35336] text-[10px] px-2 py-0.5 rounded-sm text-white">{item.discountMenus[0].discount.name}</div>
                )}
              </div>

              <p className="text-base font-medium line-clamp-1">
                {item.name}
              </p>

              {item.discountMenus.length > 0 && item.discountMenus[0].discount.type === "fixed" && (
                <div className="flex items-start justify-between gap-2">
                  <p className={item.discountMenus[0].discount.type === "fixed" ? "text-xs font-semibold line-through text-[#E35336]" : "text-xs font-semibold"}>
                    Rp {item.price.toLocaleString()}
                  </p>
                  
                  {item.discountMenus[0].discount.type === "fixed" && (
                    <p className="text-xs font-semibold ">
                      Rp. {(Number(item.price) - Number(item.discountMenus[0].discount.discount)).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {item.discountMenus.length > 0 && item.discountMenus[0].discount.type === "percent" && (
                <div className="flex items-start justify-between gap-2">
                  <p className={item.discountMenus[0].discount.type === "percent" ? "text-xs font-semibold line-through text-[#E35336]" : "text-xs font-semibold"}>
                    Rp {item.price.toLocaleString()}
                  </p>
                  
                  {item.discountMenus[0].discount.type === "percent" && (
                    <p className="text-sm font-semibold ">
                      Rp. {(Number(item.price) - (Number(item.price) * Number(item.discountMenus[0].discount.discount) / 100)).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              {
                item.discountMenus.length === 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">
                      Rp. {item.price.toLocaleString()}
                    </p>
                  </div>
                )
              }
            </div>
            <AddMenuDrawer menu={item} />
          </div>
        </div>
      ))}
    </div>
  )
}
