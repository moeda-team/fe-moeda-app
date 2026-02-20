import { Suspense } from "react"
import LoginForm from "./LoginForm"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
