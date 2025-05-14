"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Auth from "@/app/appwrite/auth"
// import DB from "@/app/appwrite/db"   
import { toast, Toaster } from "react-hot-toast"
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    Auth.login({email, password}).then(() => {
    //   console.log("Login response", res)
      toast.success("User Logged in successfully")
      router.push("/dashboard")
    })
  }

   const handleGoogleLogin = async () => {
    try{

      Auth.loginWithGoogle().then(() => {
        // console.log("Login response", res)
        toast.success("User Logged in successfully")
        router.push("/dashboard")
      })
      

    //   const data = await Auth.account.get()

    //   console.log("USer data", data)
    //     const isUSer = await DB.searchUser(data?.email)
    //     if(!isUSer){
    //         console.log("In process of creating user")
    //     DB.createUser({email : data?.email,password : data.$id,name : data.name})
    //     console.log("User created")
    //   } 
        // toast.success("User Logged in successfully")
        // router.push("/dashboard")
    }
    catch (error) {
      console.error("Error during Google login:", error)
      // Handle error (e.g., show a toast notification)
      toast.error("Error during Google login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950 p-4">
        <Toaster />
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome back</CardTitle>
            <CardDescription className="text-zinc-200">Sign in to access your secure passwords</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20"
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-zinc-400 backdrop-blur-md bg-black/30">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-zinc-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  {/* <Button variant="link" className="px-0 text-zinc-300 hover:text-white">
                    Forgot password?
                  </Button> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="..............."
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-zinc-300 w-full">
              Don&apos;t have an account?{" "}
              <Button variant="link" className="p-0 text-purple-300 hover:text-purple-200" 
              onClick={() => router.push("/signup")}>
                Sign up
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
