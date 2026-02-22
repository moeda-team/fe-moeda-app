"use client"

import Image from "next/image"
import { MenuitemBestseller } from "@/lib/api/menu/req-api"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface CardBestProps {
  data: MenuitemBestseller[]
}

export function CardBest({ data }: CardBestProps) {
  return (
    <Carousel opts={{ align: "start" }}>
      <CarouselContent>
        {data.map((item, index) => (
          <CarouselItem
            key={item.id}
            className="basis-auto cursor-pointer"
          >
            <div className="bg-primary/10 rounded-xl shadow-soft overflow-hidden flex flex-col gap-2 w-[150px]">
              <div className="relative h-28">
                <Image
                  src={item.menu.img}
                  alt={item.menu.name}
                  fill
                  className="object-cover object-top rounded-t-lg"
                />
              </div>
              <div className="absolute top-2 w-[50px] text-center mx-2 text-[10px] bg-[#E35336] text-white rounded-full px-2 py-1">No. {index + 1}</div>

              <div className="space-y-1 p-3 text-center">
                <p className="text-sm font-medium line-clamp-1">
                  {item.menu.name}
                </p>
              </div>

            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
