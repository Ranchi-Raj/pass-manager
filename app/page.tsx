import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, we would check for authentication here
  // For demo purposes, we'll just redirect to login
  redirect("/login")
}
