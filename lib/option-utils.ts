// lib/option-utils.ts

import { Choice, MenuOption } from "./api/order/req-api"

export function findOptionById(
  options: MenuOption[],
  id: string
): MenuOption | null {
  for (const option of options) {
    if (option.id === id) return option

    for (const choice of option.choices) {
      if (choice.subOptions?.length) {
        const found = findOptionById(
          choice.subOptions,
          id
        )
        if (found) return found
      }
    }
  }
  return null
}

export function collectSubOptionIds(
  choice: Choice
): string[] {
  let ids: string[] = []

  if (choice.subOptions) {
    for (const sub of choice.subOptions) {
      ids.push(sub.id)

      for (const subChoice of sub.choices) {
        ids = [
          ...ids,
          ...collectSubOptionIds(subChoice),
        ]
      }
    }
  }

  return ids
}
