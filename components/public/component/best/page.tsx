"use client"

import Image from "next/image"
import { Menuitem } from "@/lib/api/menu/req-api"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface CardBestProps {
  data: Menuitem[]
}

export function CardBest({ data }: CardBestProps) {
  return (
    <Carousel opts={{ align: "start" }}>
      <CarouselContent className="flex gap-2">
        {data.map((item, index) => (
          <CarouselItem
            key={item.id}
            className="flex-1"
          >
            <div className="bg-primary/20 rounded-xl shadow-soft overflow-hidden flex flex-col gap-2">
              <div className="relative h-28">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover object-top rounded-t-lg"
                />
              </div>
              <div className="absolute top-2 w-[50px] text-center mx-2 text-[10px] bg-[#E35336] text-white rounded-full px-2 py-1">No. {index + 1}</div>

              <div className="space-y-1 p-3 text-center">
                <p className="text-sm font-medium line-clamp-1">
                  {item.name}
                </p>
              </div>

            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
