import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
          <p className="text-sm">Rate of Change: {data.rateOfChange.toFixed(4)}</p>
          <p className="text-sm">Epoch: {data.epoch}</p>
          <p className="text-sm">Status: {data.isNew ? 'New Object' : 'Existing Object'}</p>
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
          Rate of Change Analysis
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
              dataKey="rateOfChange" 
              fill="hsl(var(--primary))"
              onClick={handleBarClick}
              className="cursor-pointer"
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          Click on any bar to view detailed satellite statistics
        </div>
      </CardContent>
    </Card>
  );
};