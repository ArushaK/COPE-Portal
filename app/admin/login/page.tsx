"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple authentication check (in production, this would be a real API call)
    if (formData.username === "admin" && formData.password === "admin123") {
      // Store authentication state in localStorage
      localStorage.setItem("admin_authenticated", "true")
      localStorage.setItem("admin_user", formData.username)
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      })
      
      // Redirect to admin dashboard
      router.push("/admin")
    } else {
      setError("Invalid username or password. Please try again.")
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please check your username and password.",
        variant: "destructive"
      })
    }
    
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-blue-600/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Demo Credentials:</p>
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              onClick={() => router.push("/")}
              className="w-full cursor-pointer"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
