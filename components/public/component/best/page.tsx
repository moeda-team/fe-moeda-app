"use client"

import Image from "next/image"
import { MenuitemBestseller } from "@/lib/api/menu/req-api"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { AddMenuDrawer } from "./AddMenu"

interface CardBestProps {
  data: MenuitemBestseller[]
}

export function CardBest({ data }: CardBestProps) {
  return (
    <Carousel opts={{ align: "start" }}>
      <CarouselContent>
        {data.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-auto cursor-pointer"
          >
            <AddMenuDrawer menu={item.menu} order={item.order ??0} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
