"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock charging station data for Chennai
const stations = [
  {
    id: "station1",
    name: "Chennai Central EV Hub",
    address: "Chennai Central Railway Station, Park Town, Chennai",
    available: 3,
    total: 5,
    distance: "1.2 km",
    price: "₹12/kWh",
  },
  {
    id: "station2",
    name: "T Nagar Charging Station",
    address: "Pondy Bazaar, T Nagar, Chennai",
    available: 1,
    total: 4,
    distance: "3.5 km",
    price: "₹14/kWh",
  },
  {
    id: "station3",
    name: "Anna Nagar EV Point",
    address: "2nd Avenue, Anna Nagar, Chennai",
    available: 4,
    total: 6,
    distance: "5.8 km",
    price: "₹11/kWh",
  },
  {
    id: "station4",
    name: "OMR Tech Corridor Chargers",
    address: "Thoraipakkam, OMR, Chennai",
    available: 2,
    total: 8,
    distance: "12.3 km",
    price: "₹10/kWh",
  },
]

export function StationsMap() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nearby Charging Stations</CardTitle>
          <CardDescription>Find charging stations near your location in Chennai</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px] w-full overflow-hidden rounded-md bg-gray-100">
            {/* This would be replaced with an actual map integration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Map showing charging stations in Chennai</p>
              {/* Placeholder for map pins */}
              <div className="absolute left-1/4 top-1/3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute left-2/3 top-1/2">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute left-1/2 top-2/3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute left-3/4 top-1/4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Stations</h2>
        {stations.map((station) => (
          <Card
            key={station.id}
            className={`cursor-pointer transition-colors ${selectedStation === station.id ? "border-primary" : ""}`}
            onClick={() => setSelectedStation(station.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{station.name}</CardTitle>
                <Badge variant={station.available > 0 ? "outline" : "destructive"}>
                  {station.available}/{station.total} Available
                </Badge>
              </div>
              <CardDescription>{station.address}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between text-sm">
                <span>Distance: {station.distance}</span>
                <span>Price: {station.price}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={station.available === 0}>
                Get Directions
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

