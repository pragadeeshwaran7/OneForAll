import { ProfileSettings } from "@/components/profile-settings"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <ProfileSettings />
    </div>
  )
}

