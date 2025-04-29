import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Intrusion Detection System",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-navy">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-cyan-400">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        
        {/* ✅ Wrap the form with Suspense */}
         <Suspense fallback={<div className="text-white text-center">Loading login form...</div>}>
          <LoginForm />
        </Suspense>

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/register" className="hover:text-brand underline underline-offset-4">
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
