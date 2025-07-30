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
  updates: Array<{
    date: string;
    time: string;
    hour: number;
  }>;
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
          updateCount: 12,
          lastUpdated: "2024-01-15T14:30:00Z",
          epoch: "2024-01-15",
          inclination: 51.6,
          eccentricity: 0.0001,
          meanMotion: 15.5,
          updates: [
            { date: "2024-01-15", time: "09:00", hour: 9 },
            { date: "2024-01-15", time: "14:30", hour: 14 },
            { date: "2024-01-16", time: "11:15", hour: 11 }
          ]
        },
        {
          noradId: "48274",
          name: "STARLINK-1947",
          type: "Communication",
          updateCount: 28,
          lastUpdated: "2024-01-16T16:45:00Z",
          epoch: "2024-01-16",
          inclination: 53.0,
          eccentricity: 0.0002,
          meanMotion: 15.1,
          updates: [
            { date: "2024-01-15", time: "08:00", hour: 8 },
            { date: "2024-01-16", time: "16:45", hour: 16 }
          ]
        },
        {
          noradId: "43013",
          name: "COSMOS 2542",
          type: "Military",
          updateCount: 8,
          lastUpdated: "2024-01-14T20:12:00Z",
          epoch: "2024-01-14",
          inclination: 82.5,
          eccentricity: 0.0003,
          meanMotion: 14.8,
          updates: [
            { date: "2024-01-14", time: "20:12", hour: 20 }
          ]
        },
        {
          noradId: "52132",
          name: "GEOSAT-2A",
          type: "Earth Observation",
          updateCount: 15,
          lastUpdated: "2024-01-17T07:22:00Z",
          epoch: "2024-01-17",
          inclination: 98.2,
          eccentricity: 0.0001,
          meanMotion: 14.2,
          updates: [
            { date: "2024-01-17", time: "07:22", hour: 7 },
            { date: "2024-01-17", time: "19:30", hour: 19 }
          ]
        },
        {
          noradId: "39084",
          name: "GPS IIF-12",
          type: "Navigation",
          updateCount: 5,
          lastUpdated: "2024-01-13T12:00:00Z",
          epoch: "2024-01-13",
          inclination: 55.0,
          eccentricity: 0.0004,
          meanMotion: 2.0,
          updates: [
            { date: "2024-01-13", time: "12:00", hour: 12 }
          ]
        },
        {
          noradId: "44506",
          name: "SENTINEL-6A",
          type: "Scientific",
          updateCount: 22,
          lastUpdated: "2024-01-18T23:45:00Z",
          epoch: "2024-01-18",
          inclination: 66.0,
          eccentricity: 0.0002,
          meanMotion: 12.8,
          updates: [
            { date: "2024-01-18", time: "23:45", hour: 23 },
            { date: "2024-01-18", time: "15:20", hour: 15 }
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