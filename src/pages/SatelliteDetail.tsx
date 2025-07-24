import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Satellite, Globe, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TLEData } from './Dashboard';

const SatelliteDetail = () => {
  const { noradId } = useParams<{ noradId: string }>();
  const navigate = useNavigate();
  const [satellite, setSatellite] = useState<TLEData | null>(null);
  const [searchNoradId, setSearchNoradId] = useState('');

  // Mock historical data for the satellite
  const historicalData = [
    { date: '2024-01-10', rateOfChange: 0.001, inclination: 51.6, eccentricity: 0.0001 },
    { date: '2024-01-11', rateOfChange: 0.0015, inclination: 51.61, eccentricity: 0.00012 },
    { date: '2024-01-12', rateOfChange: 0.002, inclination: 51.62, eccentricity: 0.00011 },
    { date: '2024-01-13', rateOfChange: 0.0018, inclination: 51.61, eccentricity: 0.00013 },
    { date: '2024-01-14', rateOfChange: 0.002, inclination: 51.6, eccentricity: 0.0001 },
  ];

  useEffect(() => {
    // Mock API call to get satellite details
    const mockSatellite: TLEData = {
      noradId: noradId || "25544",
      name: "ISS (ZARYA)",
      type: "Space Station",
      rateOfChange: 0.002,
      isNew: false,
      epoch: "2024-01-15",
      inclination: 51.6,
      eccentricity: 0.0001,
      meanMotion: 15.5
    };
    setSatellite(mockSatellite);
  }, [noradId]);

  const handleSearch = () => {
    if (searchNoradId) {
      navigate(`/satellite/${searchNoradId}`);
    }
  };

  if (!satellite) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{satellite.name}</h1>
              <p className="text-muted-foreground">NORAD ID: {satellite.noradId}</p>
            </div>
          </div>
          <Badge variant={satellite.isNew ? "default" : "secondary"}>
            {satellite.isNew ? "New Object" : "Existing Object"}
          </Badge>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search by NORAD ID
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="norad-search">NORAD ID</Label>
              <Input
                id="norad-search"
                value={searchNoradId}
                onChange={(e) => setSearchNoradId(e.target.value)}
                placeholder="Enter NORAD ID..."
              />
            </div>
            <Button onClick={handleSearch} className="mt-6">
              Load Statistics
            </Button>
          </CardContent>
        </Card>

        {/* Satellite Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satellite Type</CardTitle>
              <Satellite className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{satellite.type}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rate of Change</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{satellite.rateOfChange.toFixed(4)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inclination</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{satellite.inclination}°</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Epoch</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{satellite.epoch}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rate of Change Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rateOfChange" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orbital Parameters Scatter Plot</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="inclination" 
                    name="Inclination" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    dataKey="eccentricity" 
                    name="Eccentricity" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Scatter 
                    name="Orbital Parameters" 
                    dataKey="eccentricity" 
                    fill="hsl(var(--primary))"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Orbital Elements</h3>
                <div className="space-y-1 text-sm">
                  <p>Mean Motion: {satellite.meanMotion} rev/day</p>
                  <p>Eccentricity: {satellite.eccentricity}</p>
                  <p>Inclination: {satellite.inclination}°</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Change Analysis</h3>
                <div className="space-y-1 text-sm">
                  <p>Current Rate: {satellite.rateOfChange.toFixed(4)}</p>
                  <p>Trend: Stable</p>
                  <p>Classification: {satellite.type}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Status</h3>
                <div className="space-y-1 text-sm">
                  <p>Object Status: {satellite.isNew ? "New" : "Existing"}</p>
                  <p>Last Update: {satellite.epoch}</p>
                  <p>Data Quality: Good</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SatelliteDetail;