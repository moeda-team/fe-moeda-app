import { Menuitem } from "@/lib/api/menu/req-api"
import { AddMenuDrawer } from "../drawer/AddMenu"

interface CardMenuProps {
  data: Menuitem[],
  className?: string
}

export function CardMenu({ data, className }: CardMenuProps) {

  return (
    <div className={`grid ${className}`}>
      {data.map((item) => (
        <AddMenuDrawer key={item.id} menu={item} />
      ))}
    </div>
  )
}
