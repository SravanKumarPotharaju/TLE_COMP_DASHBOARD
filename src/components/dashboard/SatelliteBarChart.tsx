import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { TLEData } from '@/pages/Dashboard';
import { useNavigate } from 'react-router-dom';

interface SatelliteBarChartProps {
  data: TLEData[];
}

export const SatelliteBarChart: React.FC<SatelliteBarChartProps> = ({ data }) => {
  const navigate = useNavigate();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-card-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">NORAD ID: {data.noradId}</p>
          <p className="text-sm">Type: {data.type}</p>
          <p className="text-sm">Update Count: {data.updateCount}</p>
          <p className="text-sm">Epoch: {data.epoch}</p>
          <p className="text-sm">Last Updated: {data.lastUpdated}</p>
          <p className="text-xs text-muted-foreground mt-1">Click for detailed statistics</p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    navigate(`/satellite/${data.noradId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Satellite Update Frequency Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="updateCount"
              onClick={handleBarClick}
              className="cursor-pointer"
            >
              {data.map((entry, index) => {
                const typeColors: Record<string, string> = {
                  'Communication': 'hsl(var(--chart-1))',
                  'Space Station': 'hsl(var(--chart-2))',
                  'Military': 'hsl(var(--chart-3))',
                  'Scientific': 'hsl(var(--chart-4))',
                  'Earth Observation': 'hsl(var(--chart-5))',
                  'Navigation': 'hsl(var(--satellite-existing))'
                };
                return (
                  <Cell key={`cell-${index}`} fill={typeColors[entry.type] || 'hsl(var(--chart-1))'} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          Click on any bar to view detailed satellite statistics
        </div>
      </CardContent>
    </Card>
  );
};