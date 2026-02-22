"use client"

import { PublicLayout } from "@/components/public/public-layout"
import Hero from "@/components/public/component/hero/page"
import { useCategoriesQuery, useMenuQuery } from "@/components/public/hooks/use"
import { useEffect, useState } from "react"
import { InputGroup } from "@/components/ui/input-group"
import { InputGroupInput } from "@/components/ui/input-group"
import { InputGroupAddon } from "@/components/ui/input-group"
import { SearchIcon } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { CardMenu } from "@/components/public/component/menu/page"
import { CardBest } from "@/components/public/component/best/page"
import { XIcon } from "lucide-react"
import { StickyBottomCart } from "@/components/public/component/StickyCart"

export default function Home() {
  const [showSticky, setShowSticky] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All')

  // categories
  const { data : categoriesData, isLoading : isLoadingCategories } = useCategoriesQuery()
  const { data : bestData, isLoading : isLoadingBest } = useMenuQuery({ best : true })
  const { data : menuData, isLoading : isLoadingMenu } = useMenuQuery({ search : debouncedSearch, category : selectedCategory === 'All' ? "" : selectedCategory ? selectedCategory : undefined })

  // scroll set sticky 
  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 500) // 500ms delay

    return () => {
      clearTimeout(handler)
    }
  }, [searchInput])

  return (
    <PublicLayout>
      <div className="space-y-4 bg-primary/10 min-h-screen pb-15">
        {/* STICKY WRAPPER */}
        <div className={cn("sticky top-0 z-50 bg-white pb-3 pt-3 space-y-3 hidden px-2", showSticky && "block")}>
          
          {/* SEARCH */}
          <div className="w-full">
            <InputGroup className="w-full">
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

          {/* CATEGORY */}
          <div>
            {isLoadingCategories ? (
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-8 w-24 rounded-full bg-primary/30"
                  />
                ))}
              </div>
            ) : (
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="gap-2">
                  <CarouselItem
                    className="basis-auto cursor-pointer"
                    onClick={() => setSelectedCategory("All")}
                  >
                    <div
                      className={`px-4 py-1 rounded-full text-xs whitespace-nowrap transition ${
                        selectedCategory === "All"
                          ? "bg-primary text-white"
                          : "bg-primary/10"
                      }`}
                    >
                      All
                    </div>
                  </CarouselItem>

                  {categoriesData?.data?.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="basis-auto cursor-pointer"
                      onClick={() => setSelectedCategory(item.id)}
                    >
                      <div
                        className={`px-2 py-1 rounded-full text-xs whitespace-nowrap transition ${
                          selectedCategory === item.id
                            ? "bg-primary text-white"
                            : "bg-primary/10"
                        }`}
                      >
                        {item.name}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>

        </div>
        {/* STICKY WRAPPER */}
        
        {/* HERO */}
        <Hero 
          categoriesData={categoriesData?.data ?? []}
          isLoading={isLoadingCategories}
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        {/* HERO */}
        
        {/* BEST */}
        <div className="space-y-3 px-4">
          <h2 className="text-lg font-semibold">
            Best Seller
          </h2>
          {
            isLoadingBest ? 
              <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-40 rounded-2xl bg-primary/30"
                />
              ))}
              </div> : 
            <CardBest data={bestData?.data ?? []} />
          }
        </div>
        {/* BEST */}

        {/* MENU */}
        <div className="space-y-3 px-4">
          <h2 className="text-lg font-semibold">
            Menu
          </h2>
          {
            isLoadingMenu ? 
              <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-40 rounded-2xl bg-primary/30"
                />
              ))}
              </div> : 
            <CardMenu data={menuData?.data ?? []} />
          }

          {menuData?.data?.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No menu found
            </p>
          )}
        </div>
        {/* MENU */}
        <StickyBottomCart />
      </div>
    </PublicLayout>
  )
}
