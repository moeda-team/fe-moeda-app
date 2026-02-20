import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorCodePage({
  params,
}: {
  params: { code: string }
}) {
  const { code } = params

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border bg-background p-6 space-y-3">
        <h1 className="text-2xl font-semibold">{code} — Error</h1>
        <Button asChild>
          <Link href="/">Kembali ke Home</Link>
        </Button>
      </div>
    </div>
  )
}
