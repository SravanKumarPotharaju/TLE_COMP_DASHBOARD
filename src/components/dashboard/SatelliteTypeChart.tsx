import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { TLEData } from '@/pages/Dashboard';

interface SatelliteTypeChartProps {
  data: TLEData[];
}

export const SatelliteTypeChart: React.FC<SatelliteTypeChartProps> = ({ data }) => {
  const typeData = data.reduce((acc, satellite) => {
    const existing = acc.find(item => item.type === satellite.type);
    if (existing) {
      existing.count++;
      if (satellite.isNew) existing.newCount++;
    } else {
      acc.push({
        type: satellite.type,
        count: 1,
        newCount: satellite.isNew ? 1 : 0
      });
    }
    return acc;
  }, [] as Array<{ type: string; count: number; newCount: number }>);

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--muted))',
    'hsl(210, 40%, 60%)',
    'hsl(330, 40%, 60%)'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-card-foreground">{data.type}</p>
          <p className="text-sm">Total: {data.count}</p>
          <p className="text-sm">New Objects: {data.newCount}</p>
          <p className="text-sm">Existing: {data.count - data.newCount}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Satellite Distribution by Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
            >
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};