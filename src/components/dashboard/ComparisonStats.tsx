import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Satellite, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { TLEData } from '@/pages/Dashboard';

interface ComparisonStatsProps {
  data: TLEData[];
}

export const ComparisonStats: React.FC<ComparisonStatsProps> = ({ data }) => {
  const totalSatellites = data.length;
  const newObjects = data.filter(s => s.isNew).length;
  const existingObjects = totalSatellites - newObjects;
  const avgRateOfChange = data.reduce((sum, s) => sum + s.rateOfChange, 0) / totalSatellites;
  const maxRateOfChange = Math.max(...data.map(s => s.rateOfChange));
  const minRateOfChange = Math.min(...data.map(s => s.rateOfChange));

  const satelliteTypes = [...new Set(data.map(s => s.type))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Satellites</CardTitle>
          <Satellite className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSatellites}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default">{newObjects} New</Badge>
            <Badge variant="secondary">{existingObjects} Existing</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Rate of Change</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgRateOfChange.toFixed(4)}</div>
          <p className="text-xs text-muted-foreground">Per time unit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maxRateOfChange.toFixed(4)}</div>
          <p className="text-xs text-muted-foreground">Highest change rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Min Rate</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{minRateOfChange.toFixed(4)}</div>
          <p className="text-xs text-muted-foreground">Lowest change rate</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Satellite Types Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {satelliteTypes.map(type => {
              const typeCount = data.filter(s => s.type === type).length;
              const newInType = data.filter(s => s.type === type && s.isNew).length;
              return (
                <div key={type} className="flex items-center gap-2 p-2 border rounded-lg">
                  <div>
                    <span className="font-medium">{type}</span>
                    <div className="text-sm text-muted-foreground">
                      {typeCount} total ({newInType} new)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};