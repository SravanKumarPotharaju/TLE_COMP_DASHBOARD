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
      // Import the TLE loader function
      const { loadAndCompareTLEData } = await import('@/utils/tleLoader');
      
      // Load and compare real TLE data from public/tle-data folder structure
      const comparisonResults = await loadAndCompareTLEData(fromDate, toDate);
      
      // Convert to TLEData format
      const tleDataResults: TLEData[] = comparisonResults.map(result => ({
        noradId: result.noradId,
        name: result.name,
        type: result.type,
        updateCount: result.updateCount,
        lastUpdated: result.lastUpdated,
        epoch: result.epoch,
        inclination: result.inclination,
        eccentricity: result.eccentricity,
        meanMotion: result.meanMotion,
        updates: result.updates
      }));
      
      setTleData(tleDataResults);
      
      if (tleDataResults.length === 0) {
        toast({
          title: "No Data Found",
          description: `No TLE files found in /tle-data/ for the date range ${fromDate} to ${toDate}. Please ensure your TLE files are placed in the correct folder structure.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Data Loaded Successfully",
          description: `Processed ${tleDataResults.length} satellites with ${tleDataResults.reduce((sum, sat) => sum + sat.updateCount, 0)} total updates from ${fromDate} to ${toDate}`
        });
      }
    } catch (error) {
      console.error('Error loading TLE data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load TLE files. Please check that your TLE files are placed in public/tle-data/{YYYY-MM-DD}/tle_HHMMSS.txt format",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, toast, setTleData]);

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