import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

export const SatelliteTypeChart = ({ data }) => {
  const typeData = data.reduce((acc, satellite) => {
    const existing = acc.find(item => item.type === satellite.type);
    if (existing) {
      existing.count++;
      existing.totalUpdates += satellite.updateCount;
    } else {
      acc.push({
        type: satellite.type,
        count: 1,
        totalUpdates: satellite.updateCount
      });
    }
    return acc;
  }, []);

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--satellite-existing))'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-card-foreground">{data.type}</p>
          <p className="text-sm">Satellites: {data.count}</p>
          <p className="text-sm">Total Updates: {data.totalUpdates}</p>
          <p className="text-sm">Avg Updates: {(data.totalUpdates / data.count).toFixed(1)}</p>
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