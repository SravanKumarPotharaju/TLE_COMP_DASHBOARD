import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Satellite, Globe, Clock, TrendingUp, Activity, Orbit, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TLEData } from './Dashboard';
import { useSatelliteContext } from '@/contexts/SatelliteContext';
import { ContributionGrid } from '@/components/dashboard/ContributionGrid';

const SatelliteDetail = () => {
  const { noradId } = useParams<{ noradId: string }>();
  const navigate = useNavigate();
  const { tleData } = useSatelliteContext();
  const [satellite, setSatellite] = useState<TLEData | null>(null);
  const [searchNoradId, setSearchNoradId] = useState('');
  const [selectedOrbitalParam, setSelectedOrbitalParam] = useState('inclination');
  const [timePeriod, setTimePeriod] = useState('day');

  // Mock historical data for the satellite
  const historicalData = [
    { date: '2024-01-10', time: '10:00', hour: 10, rateOfChange: 0.001, inclination: 51.6, eccentricity: 0.0001, meanMotion: 15.49, altitude: 408.2 },
    { date: '2024-01-11', time: '14:30', hour: 14, rateOfChange: 0.0015, inclination: 51.61, eccentricity: 0.00012, meanMotion: 15.51, altitude: 408.8 },
    { date: '2024-01-12', time: '09:15', hour: 9, rateOfChange: 0.002, inclination: 51.62, eccentricity: 0.00011, meanMotion: 15.50, altitude: 409.1 },
    { date: '2024-01-13', time: '16:45', hour: 16, rateOfChange: 0.0018, inclination: 51.61, eccentricity: 0.00013, meanMotion: 15.48, altitude: 407.9 },
    { date: '2024-01-14', time: '12:20', hour: 12, rateOfChange: 0.002, inclination: 51.6, eccentricity: 0.0001, meanMotion: 15.52, altitude: 408.5 },
  ];

  const orbitalParams = [
    { label: 'Inclination', value: 'inclination', unit: '°' },
    { label: 'Eccentricity', value: 'eccentricity', unit: '' },
    { label: 'Mean Motion', value: 'meanMotion', unit: 'rev/day' },
    { label: 'Altitude', value: 'altitude', unit: 'km' }
  ];

  const getScatterData = () => {
    return historicalData.map(item => ({
      time: item.time,
      value: item[selectedOrbitalParam as keyof typeof item],
      date: item.date
    }));
  };

  useEffect(() => {
    // Find satellite in the loaded data or use mock data
    const foundSatellite = tleData.find(sat => sat.noradId === noradId);
    if (foundSatellite) {
      setSatellite(foundSatellite);
    } else {
      // Fallback to mock data if satellite not found in loaded data
      const mockSatellite: TLEData = {
        noradId: noradId || "25544",
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
          { date: "2024-01-15", time: "14:30", hour: 14 }
        ]
      };
      setSatellite(mockSatellite);
    }
  }, [noradId, tleData]);

  const handleSearch = () => {
    if (searchNoradId) {
      navigate(`/satellite/${searchNoradId}`);
    }
  };

  if (!satellite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-chart-1 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading satellite data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
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
          <Badge className="bg-chart-1 text-white border-0">
            {satellite.type}
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
          <Card className="border-l-4 border-l-chart-1 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satellite Type</CardTitle>
              <Satellite className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">{satellite.type}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Update Count</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">{satellite.updateCount}</div>
              <p className="text-xs text-muted-foreground mt-1">total updates</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-3 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inclination</CardTitle>
              <Orbit className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{satellite.inclination}°</div>
              <p className="text-xs text-muted-foreground mt-1">orbital angle</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-4 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Epoch</CardTitle>
              <Clock className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">{satellite.epoch}</div>
              <p className="text-xs text-muted-foreground mt-1">last updated</p>
            </CardContent>
          </Card>
        </div>

        {/* Satellite Update Activity Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Satellite Update Activity Grid
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContributionGrid data={[satellite]} timePeriod={timePeriod} />
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Update Activity Over Time</span>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Orbital Parameters vs Time</span>
                <Select value={selectedOrbitalParam} onValueChange={setSelectedOrbitalParam}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orbitalParams.map(param => (
                      <SelectItem key={param.value} value={param.value}>
                        {param.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={getScatterData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    name="Time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    dataKey="value" 
                    name={orbitalParams.find(p => p.value === selectedOrbitalParam)?.label}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value, name) => [
                      `${value}${orbitalParams.find(p => p.value === selectedOrbitalParam)?.unit || ''}`,
                      orbitalParams.find(p => p.value === selectedOrbitalParam)?.label
                    ]}
                  />
                  <Scatter 
                    name={orbitalParams.find(p => p.value === selectedOrbitalParam)?.label}
                    dataKey="value" 
                    fill="hsl(var(--chart-3))"
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
                  <p>Update Count: {satellite.updateCount}</p>
                  <p>Last Updated: {satellite.lastUpdated}</p>
                  <p>Classification: {satellite.type}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Status</h3>
                <div className="space-y-1 text-sm">
                  <p>Total Updates: {satellite.updateCount}</p>
                  <p>Epoch: {satellite.epoch}</p>
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