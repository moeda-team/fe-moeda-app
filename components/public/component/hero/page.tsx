"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchIcon, XIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { CategoryItem } from "@/lib/api/customer/req-api"
import { Dispatch, SetStateAction } from "react"

interface HeroProps {
  categoriesData: CategoryItem[]
  isLoading: boolean
  selectedCategory: string | null
  setSelectedCategory: Dispatch<SetStateAction<string | null>>
  searchInput: string
  setSearchInput: Dispatch<SetStateAction<string>>
}

export default function Hero({
  categoriesData,
  isLoading,
  selectedCategory,
  setSelectedCategory,
  searchInput,
  setSearchInput,
}: HeroProps) {
  return (
    <section className="flex flex-col gap-4">
      {/* HERO IMAGE */}
      <div className="relative h-24 overflow-hidden rounded-t-lg">
        <Image
          src="/images/header.png"
          alt="MOEDA Cafe"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* CATEGORY CAROUSEL */}
      <div className="px-4">
        {isLoading ? (
          <div className="flex gap-2 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-8 w-24 rounded-full"
              />
            ))}
          </div>
        ) : (
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="gap-2">
              {/* ALL CATEGORY */}
              <CarouselItem
                className="basis-auto cursor-pointer"
                onClick={() => setSelectedCategory("All")}
              >
                <div className="flex flex-col items-center gap-1 max-w-[70px]">
                  <div
                    className={`p-2 rounded-full transition ${
                      selectedCategory === "All"
                        ? "bg-primary"
                        : "bg-primary/30"
                    }`}
                  >
                    <Image
                      src="/images/all-categories.png"
                      alt="All"
                      width={35}
                      height={35}
                    />
                  </div>
                  <div className="text-center text-xs">
                    All
                  </div>
                </div>
              </CarouselItem>

              {/* DYNAMIC CATEGORY */}
              {categoriesData?.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="basis-auto cursor-pointer"
                  onClick={() => setSelectedCategory(item.id)}
                >
                  <div className="flex flex-col items-center gap-1 max-w-[70px]">
                    <div
                      className={`p-2 rounded-full transition ${
                        selectedCategory === item.id
                          ? "bg-primary"
                          : "bg-primary/30"
                      }`}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="text-center text-xs">
                      {item.name}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* SEARCH */}
      <div className="px-4">
        <InputGroup className="w-full border border-primary/20">
          <InputGroupInput placeholder="Cari kopi favoritmu..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <InputGroupAddon>
            <SearchIcon className="text-primary" size={18} />
          </InputGroupAddon>
          {searchInput && (
            <InputGroupAddon onClick={() => setSearchInput("")} className="cursor-pointer end-4 absolute">
              <XIcon className="text-primary" size={18} />
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
      
    </section>
  )
}
