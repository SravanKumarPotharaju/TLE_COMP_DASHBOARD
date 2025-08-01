import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, BarChart3, PieChart, Satellite, Zap } from 'lucide-react';
import { DateRangeSelector } from '@/components/dashboard/DateRangeSelector';
import { SatelliteBarChart } from '@/components/dashboard/SatelliteBarChart';
import { SatelliteTypeChart } from '@/components/dashboard/SatelliteTypeChart';
import { ComparisonStats } from '@/components/dashboard/ComparisonStats';
import { ContributionGrid } from '@/components/dashboard/ContributionGrid';
import { useSatelliteContext } from '@/contexts/SatelliteContext';
import { useToast } from '@/hooks/use-toast';

export interface TLEUpdate {
  epochTime: Date;
  tleLine1: string;
  tleLine2: string;
  hour: number;
  date: string;
  time: string;
}

export interface TLEData {
  noradId: string;
  name: string;
  type: string;
  updateCount: number;
  lastUpdated: string;
  epoch: string;
  inclination: number;
  eccentricity: number;
  meanMotion: number;
  updates: TLEUpdate[];
}

const Dashboard = () => {
  const { 
    tleData, 
    setTleData, 
    fromDate, 
    setFromDate, 
    toDate, 
    setToDate 
  } = useSatelliteContext();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxSatellites, setMaxSatellites] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLoadData = useCallback(async () => {
    if (!fromDate || !toDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both from and to dates",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to Django backend with date-based folder comparison
      const mockData: TLEData[] = [
        {
          noradId: "25544",
          name: "ISS (ZARYA)",
          type: "Space Station",
          updateCount: 3,
          lastUpdated: "2024-01-15T14:30:42Z",
          epoch: "2024-01-15",
          inclination: 51.6,
          eccentricity: 0.0001,
          meanMotion: 15.5,
          updates: [
            { 
              epochTime: new Date("2024-01-15T09:12:34Z"),
              tleLine1: "1 25544U 98067A   24015.38370000  .00001234  00000-0  23456-4 0  9991",
              tleLine2: "2 25544  51.6000 185.0000 0001234  90.0000 270.0000 15.50000000123456",
              date: "2024-01-15", 
              time: "09:12:34", 
              hour: 9 
            },
            { 
              epochTime: new Date("2024-01-15T14:30:42Z"),
              tleLine1: "1 25544U 98067A   24015.60567000  .00001567  00000-0  28901-4 0  9992",
              tleLine2: "2 25544  51.6000 182.5000 0001567  95.0000 265.0000 15.50000001123457",
              date: "2024-01-15", 
              time: "14:30:42", 
              hour: 14 
            },
            { 
              epochTime: new Date("2024-01-16T11:15:28Z"),
              tleLine1: "1 25544U 98067A   24016.46875000  .00001890  00000-0  34567-4 0  9993",
              tleLine2: "2 25544  51.6000 175.2000 0001890 100.0000 260.0000 15.50000002123458",
              date: "2024-01-16", 
              time: "11:15:28", 
              hour: 11 
            }
          ]
        },
        {
          noradId: "48274",
          name: "STARLINK-1947",
          type: "Communication",
          updateCount: 2,
          lastUpdated: "2024-01-16T16:45:15Z",
          epoch: "2024-01-16",
          inclination: 53.0,
          eccentricity: 0.0002,
          meanMotion: 15.1,
          updates: [
            { 
              epochTime: new Date("2024-01-15T08:00:12Z"),
              tleLine1: "1 48274U 21036AZ  24015.33333000  .00002345  00000-0  15678-3 0  9991",
              tleLine2: "2 48274  53.0000  45.0000 0002345 120.0000 240.0000 15.10000000567890",
              date: "2024-01-15", 
              time: "08:00:12", 
              hour: 8 
            },
            { 
              epochTime: new Date("2024-01-16T16:45:15Z"),
              tleLine1: "1 48274U 21036AZ  24016.69792000  .00003456  00000-0  23456-3 0  9992",
              tleLine2: "2 48274  53.0000  42.5000 0003456 125.0000 235.0000 15.10000001567891",
              date: "2024-01-16", 
              time: "16:45:15", 
              hour: 16 
            }
          ]
        },
        {
          noradId: "43013",
          name: "COSMOS 2542",
          type: "Military",
          updateCount: 1,
          lastUpdated: "2024-01-14T20:12:56Z",
          epoch: "2024-01-14",
          inclination: 82.5,
          eccentricity: 0.0003,
          meanMotion: 14.8,
          updates: [
            { 
              epochTime: new Date("2024-01-14T20:12:56Z"),
              tleLine1: "1 43013U 17085A   24014.84231000  .00000567  00000-0  12345-4 0  9991",
              tleLine2: "2 43013  82.5000 270.0000 0000567 180.0000   0.0000 14.80000000345678",
              date: "2024-01-14", 
              time: "20:12:56", 
              hour: 20 
            }
          ]
        },
        {
          noradId: "52132",
          name: "GEOSAT-2A",
          type: "Earth Observation",
          updateCount: 2,
          lastUpdated: "2024-01-17T19:30:18Z",
          epoch: "2024-01-17",
          inclination: 98.2,
          eccentricity: 0.0001,
          meanMotion: 14.2,
          updates: [
            { 
              epochTime: new Date("2024-01-17T07:22:45Z"),
              tleLine1: "1 52132U 22017A   24017.30729000  .00001234  00000-0  67890-4 0  9991",
              tleLine2: "2 52132  98.2000  90.0000 0001234 270.0000  90.0000 14.20000000123456",
              date: "2024-01-17", 
              time: "07:22:45", 
              hour: 7 
            },
            { 
              epochTime: new Date("2024-01-17T19:30:18Z"),
              tleLine1: "1 52132U 22017A   24017.81250000  .00001567  00000-0  89012-4 0  9992",
              tleLine2: "2 52132  98.2000  87.5000 0001567 275.0000  85.0000 14.20000001123457",
              date: "2024-01-17", 
              time: "19:30:18", 
              hour: 19 
            }
          ]
        },
        {
          noradId: "39084",
          name: "GPS IIF-12",
          type: "Navigation",
          updateCount: 1,
          lastUpdated: "2024-01-13T12:00:33Z",
          epoch: "2024-01-13",
          inclination: 55.0,
          eccentricity: 0.0004,
          meanMotion: 2.0,
          updates: [
            { 
              epochTime: new Date("2024-01-13T12:00:33Z"),
              tleLine1: "1 39084U 13023A   24013.50000000 -.00000012  00000-0  00000+0 0  9991",
              tleLine2: "2 39084  55.0000 315.0000 0000400 225.0000 135.0000  2.00000000123456",
              date: "2024-01-13", 
              time: "12:00:33", 
              hour: 12 
            }
          ]
        },
        {
          noradId: "44506",
          name: "SENTINEL-6A",
          type: "Scientific",
          updateCount: 2,
          lastUpdated: "2024-01-18T23:45:21Z",
          epoch: "2024-01-18",
          inclination: 66.0,
          eccentricity: 0.0002,
          meanMotion: 12.8,
          updates: [
            { 
              epochTime: new Date("2024-01-18T15:20:09Z"),
              tleLine1: "1 44506U 19049A   24018.63889000  .00000890  00000-0  45678-4 0  9991",
              tleLine2: "2 44506  66.0000 120.0000 0000890 315.0000  45.0000 12.80000000234567",
              date: "2024-01-18", 
              time: "15:20:09", 
              hour: 15 
            },
            { 
              epochTime: new Date("2024-01-18T23:45:21Z"),
              tleLine1: "1 44506U 19049A   24018.98958000  .00001123  00000-0  56789-4 0  9992",
              tleLine2: "2 44506  66.0000 117.8000 0001123 320.0000  40.0000 12.80000001234568",
              date: "2024-01-18", 
              time: "23:45:21", 
              hour: 23 
            }
          ]
        }
      ];
      
      setTleData(mockData);
      toast({
        title: "Data Loaded Successfully",
        description: `Processed ${mockData.length} satellites from ${fromDate} to ${toDate}`
      });
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to process TLE comparison data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, toast]);

  const filteredData = tleData.filter(satellite => 
    selectedType === 'all' || satellite.type === selectedType
  ).slice(0, maxSatellites);

  const satelliteTypes = [...new Set(tleData.map(s => s.type))];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-chart-1 to-chart-2">
              <Satellite className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
              Satellite TLE Comparison Dashboard
            </h1>
            <div className="p-3 rounded-full bg-gradient-to-r from-chart-2 to-chart-3">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground text-lg">Professional analysis of Two-Line Element data with real-time visualization</p>
        </div>

        {/* Date Range Selection */}
        <DateRangeSelector 
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onLoad={handleLoadData}
          loading={loading}
        />

        {tleData.length > 0 && (
          <>
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Chart Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Label>Satellite Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {satelliteTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Satellites</Label>
                  <Input 
                    type="number" 
                    value={maxSatellites} 
                    onChange={(e) => setMaxSatellites(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Legend</Label>
                  <div className="flex gap-2">
                    <Badge className="bg-chart-1 text-white border-0">Communication</Badge>
                    <Badge className="bg-chart-2 text-white border-0">Space Station</Badge>
                    <Badge className="bg-chart-3 text-white border-0">Military</Badge>
                    <Badge className="bg-chart-4 text-white border-0">Scientific</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SatelliteBarChart data={filteredData} />
              <SatelliteTypeChart data={tleData} />
            </div>

            {/* GitHub-like Contribution Grid */}
            <ContributionGrid data={tleData} />

            {/* Comparison Statistics */}
            <ComparisonStats data={tleData} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;