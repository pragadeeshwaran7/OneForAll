import { LoginForm } from "@/components/login-form"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent p-4 shadow-lg">
            <Logo className="h-12 w-12 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">ChargePay</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Web3-powered charging station payment app</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}

