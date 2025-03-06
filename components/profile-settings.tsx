"use client"

import { useState } from "react"
import { User, Mail, Phone, CreditCard, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/hooks/use-web3"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export function ProfileSettings() {
  const { toast } = useToast()
  const { account, isConnected, disconnectWallet } = useWeb3()
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: "Raj Kumar",
    email: "raj.kumar@example.com",
    phone: "+91 98765 43210",
    vehicle: "Tata Nexon EV",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    if (isConnected) {
      disconnectWallet()
    }

    // Simulate logout
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })

    // In a real app, you would redirect to login page
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <CardHeader className="relative gradient-bg text-white">
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
              <AvatarFallback>RK</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription className="text-white/80">{profile.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isConnected && (
            <div className="mb-4 rounded-lg bg-accent/10 p-3">
              <p className="text-sm font-medium">Connected Wallet</p>
              <p className="mt-1 break-all text-xs text-muted-foreground">{account}</p>
            </div>
          )}

          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-4 pt-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle Model</Label>
                    <Input
                      id="vehicle"
                      value={profile.vehicle}
                      onChange={(e) => setProfile({ ...profile, vehicle: e.target.value })}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border-b pb-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{profile.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b pb-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b pb-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle Model</p>
                      <p className="font-medium">{profile.vehicle}</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="security" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about your account via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={profile.notifications.email}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, email: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your mobile device</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={profile.notifications.push}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, push: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={profile.notifications.sms}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, sms: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-toggle">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch id="theme-toggle" checked={theme === "dark"} />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="payment" className="space-y-4 pt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">HDFC Bank ****4532</p>
                      <p className="text-xs text-muted-foreground">Expires 04/25</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {isEditing ? (
            <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="flex-1 gradient-bg" onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

