import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Textarea } from "@/components/ui/textarea"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">
          Dashboard — {session.user.name}
        </h1>

        <Textarea placeholder="Write something..." />
      </div>
    </DashboardLayout>
  )
}
