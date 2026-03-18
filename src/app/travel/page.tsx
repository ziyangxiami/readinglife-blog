import TravelMap from '@/components/travel-map'
import { getTripsData } from '@/lib/sanity-api'

export const revalidate = 60 // Revalidate cache every 60 seconds

export default async function TravelPage() {
  const trips = await getTripsData()
  
  return <TravelMap trips={trips} />
}
