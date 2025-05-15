"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Plus, Trash2, Copy, LogOut, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Auth from "@/app/appwrite/auth"
import DB from "@/app/appwrite/db"
import { toast, Toaster} from "react-hot-toast"
import Loader from "../components/Loader"
import LoggingOut from "../components/LoggingOut"
import hasher from "../utils/hasher"
// Password item type
interface PasswordItem {
  id: string
  website: string
  username: string
  password: string
}

export default function Dashboard() {

//   const { toast } = useToast()
  const router = useRouter()
  const [passwords, setPasswords] = useState<PasswordItem[]>([])
  const [renderPasswords, setRenderPasswords] = useState<PasswordItem[]>([])
  const [editedPassword, setEditedPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState({
    website: "",
    username: "",
    password: "",
  })
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [seachedWebsite, setSearchedWebsite] = useState("")
  // Load demo data on first render
  useEffect(() => {
    const demoPasswords: PasswordItem[] = [ 
    ]

    setLoading(true)

    setPasswords(demoPasswords)
    async function fetchData() {
        try{
            // Getting the login in user account
            const data = await Auth.account.get()
            console.log("USer data", data)

            // Setting the required data
            const user = await DB.getUser(data?.email)
            //Setting the email and name of the User
            setEmail(data.email)
            setUserName(data.name)
            // Settiing the available passwords
            const allPasswords : string[] = user.websitePasswords

            const parsedPasswords = allPasswords.map((item) => JSON.parse(item))
            setPasswords(parsedPasswords)
            setRenderPasswords(parsedPasswords)
            const isUSer = await DB.searchUser(data?.email)
            if(!isUSer){
                console.log("In process of creating user")
                await DB.createUser({email : data?.email,password : data.$id,name : data.name})
                console.log("User created")
            }

            setLoading(false)
        }
        catch (error) {
            console.error("Error during login:", error)
            // Handle error (e.g., show a toast notification)
            toast.error("Error during login")
        }
    }

    fetchData()

  }, [])

  // For Quering based on the Searched Webiste Name

  useEffect(() => {
    if (seachedWebsite) {
      const filteredPasswords = passwords.filter((item) =>
        item.website.toLowerCase().startsWith(seachedWebsite.toLowerCase())
      )
      setRenderPasswords(filteredPasswords)
    } else {
      setRenderPasswords(passwords)
    }
  },[passwords,seachedWebsite])
  const togglePasswordVisibility = async (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    })) 
  }

  const handleAddPassword = async () => {
    if (!newPassword.website || !newPassword.username || !newPassword.password) {
        toast.error("Please fill in all fields")
        return
    }

    const encryptedPassword = await hasher.hashPassword(newPassword.password)

    const newItem: PasswordItem = {
      id: Date.now().toString(),
      website: newPassword.website,
      username: newPassword.username,
      password: encryptedPassword,
    }

    const stringifiedPassord : string[] = passwords.map((item) => JSON.stringify(item))    
    DB.addPassword({email,passToAdd : [...stringifiedPassord,JSON.stringify(newItem)]})
    .then(() => {
        console.log("Password added to database")
        setPasswords((prev) => [...prev, newItem])
        setRenderPasswords((prev) => [...prev, newItem])
        toast.success("Password added successfully")
      })
      .catch((error) => {
        console.error("Error adding password to database:", error)
        toast.error("Error adding password to database")
      })

    setNewPassword({ website: "", username: "", password: "" })
    setIsAddModalOpen(false)

    // toast.success("Password added successfully")
  }


  const copyToClipboard = (text: string) => {
    // Decrypt the password before copying
    const decryptedPassword = hasher.decryptPassword(text)
      navigator.clipboard.writeText(decryptedPassword)
      toast.success("Password copied to clipboard")
    
    // navigator.clipboard.writeText(text)
  }

  const handleLogout =  () => {
      setIsLoggingOut(true)
      try{
         Auth.logout()
        .then(() => {
            toast.success("Logged out successfully")
            // Redirect to login page
                router.push("/login") 
                setIsLoggingOut(false)
            })

    }
    catch (error) {
        console.error("Error logging out:", error)
        toast.error("Error logging out")
        // Handle error (e.g., show a toast notification)
      }
  }

  const handlePasswordChange = async (item : PasswordItem) => {
      
      const encryptedPassword = await hasher.hashPassword(editedPassword)
      const newPasswords = passwords.map((password) => password.id === item.id ? {...item,password : encryptedPassword} : password)
      const stringifiedPassword : string[] = newPasswords.map((item) => JSON.stringify(item))    
      await DB.addPassword({email,passToAdd : [...stringifiedPassword]})
      setPasswords(newPasswords)
      setRenderPasswords(newPasswords)

    toast.success("Password changed successfully")
    setChangePasswordModal(false)
  }

  const handleDeletePassword = async (item : PasswordItem) => {
      
    console.log("Delete function called")
    const newPasswords = passwords.filter((password) => password.id !== item.id)
    setPasswords(newPasswords)
    setRenderPasswords(newPasswords)
    const stringifiedPassord : string[] = newPasswords.map((item) => JSON.stringify(item))    
    await DB.addPassword({email,passToAdd : [...stringifiedPassord]})
  }

  if(loading)
    return <Loader/>

  if(isLoggingOut)
    return <LoggingOut/>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950">
     <Toaster /> 
     <header className="backdrop-blur-md bg-black/30 border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Password Vault</h1>
         
          <div className="flex items-center gap-4">
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-5 w-5 mr-2" />
                  <p className="hidden sm:block">Add Password</p>
                    <p className="block sm:hidden">Add</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-md bg-slate-900/90 border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Password</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Enter the details for the new password you want to save.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website or App</Label>
                    <Input
                      id="website"
                      placeholder="e.g. Netflix, Amazon"
                      value={newPassword.website}
                      onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username or Email</Label>
                    <Input
                      id="username"
                      placeholder="username@example.com"
                      value={newPassword.username}
                      onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newPassword.password}
                      onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="border-white/20 text-white"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddPassword} className="bg-purple-600 hover:bg-purple-700">
                    Save Password
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/10">
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">

        <p className="text-2xl text-center font-semibold text-white mb-4">
          Welcome, {userName}
        </p>
        <div className="flex justify-center mb-4">



        <div className="relative w-1/2 md:w-1/3">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 text-center w-full"
              onChange={(e) => setSearchedWebsite(e.target.value)}
              value={seachedWebsite}
            />
          </div>

        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          {renderPasswords.map((item) => (
            <Card key={item.id} className="backdrop-blur-md bg-white/5 border-white/10 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{item.website}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(item.password)}
                      className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePasswordVisibility(item.id)}
                      className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                    >
                      {visiblePasswords[item.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>

                    {/* // For editing */}


       <Dialog open={changePasswordModal} onOpenChange={setChangePasswordModal}>
  <DialogTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
    >
      <Pencil className="h-4 w-4" />
    </Button>
  </DialogTrigger>

  <DialogContent className="backdrop-blur-md bg-slate-900/90 border-white/20 text-white">
    <DialogHeader>
      <DialogTitle>Change Password</DialogTitle>
      <DialogDescription className="text-zinc-400">
        Update the password for this entry.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="edited-password">New Password</Label>
        <Input
          id="edited-password"
          type="password"
          value={editedPassword}
          onChange={(e) => setEditedPassword(e.target.value)}
          className="bg-white/5 border-white/20"
        />
      </div>
    </div>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setChangePasswordModal(false)}
        className="border-white/20 text-white"
      >
        Cancel
      </Button>
      <Button
        onClick={() => handlePasswordChange(item)}
        className="bg-purple-600 hover:bg-purple-700"
      >
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
        </Dialog>

            {/* For deleting */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeletePassword}
                className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-white/10"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-zinc-400">Username</div>
                  <div className="font-medium">{item.username}</div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-sm text-zinc-400">Password</div>
                  <div className="font-medium">{visiblePasswords[item.id] ? hasher.decryptPassword(item.password) : "••••••••••"}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {passwords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/60 mb-4">No passwords saved yet</div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Password
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
