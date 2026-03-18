'use client'

import React, { useEffect, useState, useMemo } from 'react'
import * as echarts from 'echarts/core'
import { MapChart, EffectScatterChart, ScatterChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, VisualMapComponent, GeoComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { Navigation } from '@/components/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Map, MapPin } from 'lucide-react'
import Image from 'next/image'

// Register ECharts core components
echarts.use([
  MapChart, 
  EffectScatterChart, 
  ScatterChart,
  TitleComponent, 
  TooltipComponent, 
  VisualMapComponent, 
  GeoComponent,
  CanvasRenderer
])

type MapType = 'world' | 'china'

interface TripData {
  id: string
  title: string
  locationName: string
  country: string
  visitDate?: string
  coverImage: string | null
  gallery: string[]
  notes?: string
}

interface TravelMapProps {
  trips: TripData[]
}

export default function TravelMap({ trips }: TravelMapProps) {
  const [mapType, setMapType] = useState<MapType>('world')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [mapsLoaded, setMapsLoaded] = useState({ world: false, china: false })

  // Extract visited places for highlighting
  const visitedCountries = useMemo(() => {
    return Array.from(new Set(trips.map(t => t.country).filter(Boolean)))
  }, [trips])

  const visitedProvinces = useMemo(() => {
    // Treat 'China' trips locations as provinces
    return Array.from(new Set(
      trips.filter(t => t.country === 'China').map(t => t.locationName).filter(Boolean)
    ))
  }, [trips])

  // Get trips for currently selected area
  const currentTrips = useMemo(() => {
    if (!selectedLocation) return []
    if (mapType === 'world') {
      return trips.filter(t => t.country === selectedLocation)
    } else {
      return trips.filter(t => t.locationName.includes(selectedLocation) || selectedLocation.includes(t.locationName))
    }
  }, [selectedLocation, mapType, trips])

  // Load Map JSON data
  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const [worldRes, chinaRes] = await Promise.all([
          fetch('/maps/world.json'),
          fetch('/maps/china.json')
        ])
        const worldJson = await worldRes.json()
        const chinaJson = await chinaRes.json()
        
        echarts.registerMap('world', worldJson)
        echarts.registerMap('china', chinaJson)
        
        setMapsLoaded({ world: true, china: true })
      } catch (err) {
        console.error('Failed to load map data:', err)
      }
    }
    fetchMaps()
  }, [])

  // ECharts generic config
  const getMapOption = () => {
    if (!mapsLoaded.world || !mapsLoaded.china) return {}

    const isWorld = mapType === 'world'
    const highlightData = isWorld 
      ? visitedCountries.map(name => ({ name, value: 1 }))
      : visitedProvinces.map(name => ({ name, value: 1 }))

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.value === 1) {
            return `${params.name}<br/>(点击查看记录)`
          }
          return params.name
        }
      },
      visualMap: {
        show: false,
        min: 0,
        max: 1,
        inRange: {
          color: ['#f3f4f6', '#3b82f6'] // Unvisited gray, visited blue
        }
      },
      series: [
        {
          type: 'map',
          map: isWorld ? 'world' : 'china',
          roam: true, // Allow zoom and pan
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              areaColor: '#60a5fa', // Lighter blue on hover
            },
            label: { show: true, color: '#1f2937' }
          },
          select: {
            itemStyle: {
              areaColor: '#2563eb' // Darker blue on select
            }
          },
          data: highlightData,
          nameMap: isWorld ? {
            // Add some common name mappings if needed
            'United States of America': 'United States',
          } : undefined
        }
      ]
    }
  }

  const handleMapClick = (params: any) => {
    if (params.value === 1) {
      setSelectedLocation(params.name)
      // Scroll to trips section
      document.getElementById('trips-section')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      setSelectedLocation(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">我的足迹</h1>
            <p className="text-gray-500">
              去过 {visitedCountries.length} 个国家, {visitedProvinces.length} 个省份
            </p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border">
            <Button 
              variant={mapType === 'world' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => { setMapType('world'); setSelectedLocation(null); }}
              className="flex gap-2"
            >
              <Map className="w-4 h-4" /> 世界地图
            </Button>
            <Button 
              variant={mapType === 'china' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => { setMapType('china'); setSelectedLocation(null); }}
              className="flex gap-2"
            >
              <MapPin className="w-4 h-4" /> 中国地图
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <Card className="mb-12 overflow-hidden bg-white shadow-sm border-gray-200">
          <CardContent className="p-0">
            <div className="h-[60vh] min-h-[400px] w-full relative">
              {mapsLoaded.world && mapsLoaded.china ? (
                <ReactEChartsCore
                  echarts={echarts}
                  option={getMapOption()}
                  style={{ height: '100%', width: '100%' }}
                  onEvents={{ click: handleMapClick }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  加载地图数据中...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Display Section */}
        <div id="trips-section" className="scroll-mt-8">
          {selectedLocation ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-blue-500" />
                {selectedLocation} 的记忆
              </h2>
              
              {currentTrips.length > 0 ? (
                <div className="space-y-12">
                  {currentTrips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="md:flex">
                        {/* Trip Info */}
                        <div className="p-6 md:w-1/3 flex flex-col justify-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                          <p className="text-sm text-gray-500 mb-4">{trip.visitDate}</p>
                          {trip.notes && (
                            <p className="text-gray-700 leading-relaxed">{trip.notes}</p>
                          )}
                        </div>
                        
                        {/* Trip Gallery */}
                        <div className="md:w-2/3 p-6 bg-gray-50 border-l border-gray-100 flex gap-4 overflow-x-auto snap-x pt-6 pb-6">
                            {trip.coverImage && (
                              <div className="shrink-0 snap-center relative w-64 h-64 rounded-lg overflow-hidden shadow-sm">
                                <Image
                                  src={trip.coverImage}
                                  alt="Cover"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            {trip.gallery && trip.gallery.map((img, idx) => (
                              <div key={idx} className="shrink-0 snap-center relative w-64 h-64 rounded-lg overflow-hidden shadow-sm">
                                <Image
                                  src={img}
                                  alt={`Gallery image ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                            {!trip.coverImage && (!trip.gallery || trip.gallery.length === 0) && (
                              <div className="w-full text-center text-gray-400 italic py-20">
                                还没有上传照片哦
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">你标记了去过 {selectedLocation}，但还没在后台添加详细日志和照片哦。</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
              <p>点击地图上高亮的蓝色区域，查看相关游记与照片</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
