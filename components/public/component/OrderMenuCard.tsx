"use client"

import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { TransactionOrder } from "@/lib/api/customer/req-api"
import { Progress } from "@/components/ui/progress"

type Props = {
  data: TransactionOrder[]
  onClick?: (item: TransactionOrder) => void
  className?: string
}

export function OrderMenuCarousel({
  data,
  onClick,
  className,
}: Props) {
  return (
    <Carousel
      opts={{ align: "start" }}
      className={cn("w-full", className)}
    >
      <CarouselContent className="-ml-4">
        {data.map((item) => {
          const total = item.subTransactions.length
          const completed = item.subTransactions.map((sub) => sub.status).filter((status) => status === "completed").length
          const progress = completed / total * 100
          return(
            <CarouselItem 
              key={item.id}
              className="pl-4 basis-full"
            >
              <div
                onClick={() => {
                  onClick?.(item)
                }}
                className="bg-white rounded-tl-xl rounded-tr-xl py-2 px-6 shadow-sm border cursor-pointer hover:shadow-md transition"
              >
                {/* TOP SECTION */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-sm overflow-hidden bg-muted">
                      <Image
                        src={item.subTransactions[0].menu.img}
                        alt={item.subTransactions[0].menu.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">
                        {item.subTransactions[0].menu.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.paymentNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-green-900/60 font-medium text-sm">
                    <span>View Order</span>
                    {item.subTransactions.length > 1 ? <span className="text-xs">+ {item.subTransactions.length - 1}</span> : null}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Divider */}
                <Progress value={progress} className="mt-2" /> 

                {/* Progress */}
                <p className="text-sm text-muted-foreground">
                  {completed} of {total} items completed
                </p>
              </div>
            </CarouselItem>
          )}
        )}
      </CarouselContent>
    </Carousel>
  )
}