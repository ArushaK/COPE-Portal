"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Loader2 } from "lucide-react"

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = localStorage.getItem("admin_authenticated")
      const adminUser = localStorage.getItem("admin_user")
      
      if (authStatus === "true" && adminUser) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    router.push("/admin/login")
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-blue-600/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-blue-600/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
              <p className="text-muted-foreground mt-2">
                You need to be authenticated to access the admin dashboard.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 cursor-pointer"
            >
              Go to Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/")}
              className="w-full cursor-pointer"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
