import { Menuitem } from "@/lib/api/menu/req-api"
import { AddMenuDrawer } from "../drawer/AddMenu"

interface CardMenuProps {
  data: Menuitem[],
  className?: string
  alreadyOpen?: boolean
}

export function CardMenu({ data, className, alreadyOpen }: CardMenuProps) {

  return (
    <div className={`grid ${className}`}>
      {data.map((item) => (
        <AddMenuDrawer key={item.id} menu={item} alreadyOpen={alreadyOpen}/>
      ))}
    </div>
  )
}
