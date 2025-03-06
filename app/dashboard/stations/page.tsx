import { StationsMap } from "@/components/stations-map"

export default function StationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Charging Stations</h1>
      <StationsMap />
    </div>
  )
}

