import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, BarChart3, PieChart } from 'lucide-react';
import { FileUploadSection } from '@/components/dashboard/FileUploadSection';
import { SatelliteBarChart } from '@/components/dashboard/SatelliteBarChart';
import { SatelliteTypeChart } from '@/components/dashboard/SatelliteTypeChart';
import { ComparisonStats } from '@/components/dashboard/ComparisonStats';
import { useToast } from '@/hooks/use-toast';

export interface TLEData {
  noradId: string;
  name: string;
  type: string;
  rateOfChange: number;
  isNew: boolean;
  epoch: string;
  inclination: number;
  eccentricity: number;
  meanMotion: number;
}

const Dashboard = () => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [tleData, setTleData] = useState<TLEData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxSatellites, setMaxSatellites] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLoadFiles = useCallback(async () => {
    if (!currentFile || !referenceFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both current and reference TLE files",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to Django backend
      const mockData: TLEData[] = [
        {
          noradId: "25544",
          name: "ISS (ZARYA)",
          type: "Space Station",
          rateOfChange: 0.002,
          isNew: false,
          epoch: "2024-01-15",
          inclination: 51.6,
          eccentricity: 0.0001,
          meanMotion: 15.5
        },
        {
          noradId: "48274",
          name: "STARLINK-1947",
          type: "Communication",
          rateOfChange: 0.015,
          isNew: true,
          epoch: "2024-01-16",
          inclination: 53.0,
          eccentricity: 0.0002,
          meanMotion: 15.1
        },
        {
          noradId: "43013",
          name: "COSMOS 2542",
          type: "Military",
          rateOfChange: 0.008,
          isNew: false,
          epoch: "2024-01-14",
          inclination: 82.5,
          eccentricity: 0.0003,
          meanMotion: 14.8
        }
      ];
      
      setTleData(mockData);
      toast({
        title: "Files Loaded Successfully",
        description: `Processed ${mockData.length} satellites from TLE files`
      });
    } catch (error) {
      toast({
        title: "Error Loading Files",
        description: "Failed to process TLE files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentFile, referenceFile, toast]);

  const filteredData = tleData.filter(satellite => 
    selectedType === 'all' || satellite.type === selectedType
  ).slice(0, maxSatellites);

  const satelliteTypes = [...new Set(tleData.map(s => s.type))];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Satellite TLE Comparison Dashboard</h1>
          <p className="text-muted-foreground">Professional analysis of Two-Line Element data</p>
        </div>

        {/* File Upload Section */}
        <FileUploadSection 
          currentFile={currentFile}
          referenceFile={referenceFile}
          onCurrentFileChange={setCurrentFile}
          onReferenceFileChange={setReferenceFile}
          onLoad={handleLoadFiles}
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
                    <Badge variant="default">New Objects</Badge>
                    <Badge variant="secondary">Existing Objects</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SatelliteBarChart data={filteredData} />
              <SatelliteTypeChart data={tleData} />
            </div>

            {/* Comparison Statistics */}
            <ComparisonStats data={tleData} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;