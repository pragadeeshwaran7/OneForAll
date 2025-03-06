import { LoginForm } from "@/components/login-form"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="h-16 w-16" />
          <h1 className="mt-4 text-3xl font-bold">ChargePay</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Web3-powered charging station payment app</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}

