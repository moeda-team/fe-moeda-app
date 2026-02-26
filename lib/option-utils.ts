// lib/option-utils.ts

import { Choice, MenuOption } from "./api/customer/req-api"

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
export function mappingOption(
  selectedOptions: Record<string, string[]>,
  menuItemOptions: MenuOption[]
): string {
  // 🔥 recursive finder
  const findChoiceLabel = (
      options: MenuOption[],
      choiceId: string
    ): string | null => {
      for (const option of options) {
        for (const choice of option.choices) {
          if (choice.value === choiceId) {
            return choice.label
          }

          if (choice.subOptions?.length) {
            const found = findChoiceLabel(
              choice.subOptions,
              choiceId
            )
            if (found) return found
          }
        }
      }
      return null
    }

  const allSelectedIds = Object.values(selectedOptions).flat()

  const labels = allSelectedIds
    .map((choiceId) =>
      findChoiceLabel(menuItemOptions, choiceId)
    )
    .filter((label): label is string => Boolean(label))

  return labels.join(", ")
}

export type MenuFormValueOptions = {
  menuId: string
  data: MenuOption[]
}