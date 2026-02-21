import Image from "next/image"
import { Menuitem } from "@/lib/api/menu/req-api"
import { AddMenuDrawer } from "../drawer/AddMenu"
import { TicketPercent } from "lucide-react"
import React from "react"

interface CardMenuProps {
  data: Menuitem[]
}

export function CardMenu({ data }: CardMenuProps) {
  const [open, setOpen] = React.useState(false)

  data = data.map((item) => {
    return {
      ...item,
      disc: 10000,
      discType: "nominal",
      promoName: "Promo Spesial"
    }
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      {data.map((item) => (
        <div 
          key={item.id} 
          className="bg-card rounded-xl shadow-soft overflow-hidden p-3 flex flex-col space-y-1"
          onClick={() => {
            setOpen(true)
          }}>
          <div className="relative h-28">
            <Image
              src={item.img}
              alt={item.name}
              fill
              className="object-cover rounded-sm"
            />
            
            {item.disc > 0 && (
              <div className="absolute top-1 left-1 bg-green-100/90 text-[10px] px-2 py-1 rounded-sm text-green-900 flex items-center">
                <TicketPercent size={15}/>
                {item.discType === "nominal" ? (
                  <div className="text-[10px] ml-1">Rp.{item.disc?.toLocaleString()}</div>
                ) : (
                  <div className="text-[10px] ml-1">{item.disc}%</div>
                )}
              </div>
            )}
          </div>
          
          {/* label promo */}
          <div className="flex items-center justify-between">
            {item.promoName && (
              <div className="bg-[#E35336] text-[10px] px-2 py-0.5 rounded-sm text-white">{item.promoName}</div>
            )}
          </div>
          
          {/* price */}
          <div className="">
            <p className="text-base font-medium line-clamp-1">
              {item.name}
            </p>

            {item.discType === "nominal" && (
              <div className="flex items-start justify-between gap-2">
                <p className={item.disc > 0 ? "text-xs font-semibold line-through text-[#E35336]" : "text-xs font-semibold"}>
                  Rp {item.price.toLocaleString()}
                </p>
                
                {item.disc > 0 && (
                  <p className="text-xs font-semibold ">
                    Rp. {(Number(item.price) - Number(item.disc)).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {item.discType === "persentase" && (
              <div className="flex items-start justify-between gap-2">
                <p className={item.disc > 0 ? "text-xs font-semibold line-through text-[#E35336]" : "text-xs font-semibold"}>
                  Rp {item.price.toLocaleString()}
                </p>
                
                {item.disc > 0 && (
                  <p className="text-xs font-semibold ">
                    Rp. {(Number(item.price) - (Number(item.price) * Number(item.disc) / 100)).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <AddMenuDrawer 
            menu={{
            ...item,
              options: [
                {
                  id: "1",
                  label: "Type",
                  type: "single",
                  required: true,
                  choices: [
                    { label: "Hot", value: "hot" },
                    {
                      label: "Ice",
                      value: "ice",
                      subOptions: [
                        {
                          id: "ice_level",
                          label: "Ice Level",
                          type: "single",
                          choices: [
                            { label: "Less", value: "less",subOptions: [
                              {
                                id: "ice_level_sub",
                                label: "Ice Level Sub",
                                type: "single",
                                choices: [
                                  { label: "Less", value: "less" },
                                  { label: "Normal", value: "normal" },
                                  { label: "More", value: "more" },
                                ],
                              }
                            ] },
                            { label: "Normal", value: "normal", subOptions: [] },
                            { label: "More", extraPrice: 5000, value: "more", subOptions: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "2",
                  label: "Rasa",
                  type: "single",
                  required: true,
                  choices: [
                    { label: "Pedas", value: "spicy" },
                  ],
                },
              ],
            }} 
            open={open}
            setOpen={setOpen}
          />
        </div>
      ))}
    </div>
  )
}
