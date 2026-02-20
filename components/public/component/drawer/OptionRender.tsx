import { MenuOption } from "@/lib/api/customer/req-api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type OptionRendererProps = {
  option: MenuOption
  selectedOptions: Record<string, string[]>
  handleSelect: (
    optionId: string,
    value: string,
    type: "single" | "multiple"
  ) => void
}

export function OptionRenderer({
  option,
  selectedOptions,
  handleSelect,
}: OptionRendererProps) {
  const selected = selectedOptions[option.id] ?? []

  return (
    <div className="mb-2">
      {/* Option Label */}
      <p className="text-xs font-medium mb-2">
        {option.label}
        {option.required && (
          <span className="text-red-500 text-xs ml-1">*</span>
        )}
      </p>

      {/* Parent Choices */}
      <div className="flex flex-wrap gap-2">
        {option.choices.map((choice) => {
          const isActive = selected.includes(choice.value)

          return (
            <Button
              key={choice.value}
              type="button"
              size="xs"
              variant={isActive ? "default" : "outline"}
              className={cn(
                "rounded-lg px-4 bg-primary/10",
                isActive &&
                  "bg-primary hover:bg-primary/90 text-white"
              )}
              onClick={() =>
                handleSelect(option.id, choice.value, option.type)
              }
            >
              {choice.label}
              {choice.extraPrice
                ? ` +${choice.extraPrice.toLocaleString("id-ID")}`
                : ""}
            </Button>
          )
        })}
      </div>

      {/* 🔥 Render Sub Options in NEW ROW */}
      {option.choices.map((choice) => {
        const isActive = selected.includes(choice.value)

        if (!isActive || !choice.subOptions?.length) return null

        return (
          <div key={choice.value} className="mt-4">
            {choice.subOptions.map((childOption) => (
              <OptionRenderer
                key={childOption.id}
                option={childOption}
                selectedOptions={selectedOptions}
                handleSelect={handleSelect}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
