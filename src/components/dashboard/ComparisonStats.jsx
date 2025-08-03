import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Satellite, TrendingUp, TrendingDown, Activity, Plus, Archive, ArrowUp, ArrowDown } from 'lucide-react';

export const ComparisonStats = ({ data }) => {
  const totalSatellites = data.length;
  const totalUpdates = data.reduce((sum, sat) => sum + sat.updateCount, 0);
  const avgUpdateCount = totalUpdates / totalSatellites;
  const maxUpdateCount = Math.max(...data.map(sat => sat.updateCount));
  const minUpdateCount = Math.min(...data.map(sat => sat.updateCount));

  const satelliteTypes = [...new Set(data.map(s => s.type))];

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-chart-1 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Satellites</CardTitle>
            <Satellite className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">{totalSatellites}</div>
            <p className="text-xs text-muted-foreground mt-1">tracked objects</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Updates</CardTitle>
            <Plus className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{totalUpdates}</div>
            <p className="text-xs text-muted-foreground mt-1">in date range</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Updates</CardTitle>
            <Archive className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{avgUpdateCount.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">per satellite</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-4 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Updates</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{maxUpdateCount}</div>
            <p className="text-xs text-muted-foreground mt-1">most active satellite</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-chart-5 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Min Updates</CardTitle>
            <ArrowDown className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{minUpdateCount}</div>
            <p className="text-xs text-muted-foreground mt-1">least active satellite</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-satellite-new hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Update Range</CardTitle>
            <ArrowUp className="h-4 w-4 text-satellite-new" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-satellite-new">{maxUpdateCount - minUpdateCount}</div>
            <p className="text-xs text-muted-foreground mt-1">activity spread</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-satellite-existing hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Rate</CardTitle>
            <Activity className="h-4 w-4 text-satellite-existing" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-satellite-existing">{(totalUpdates / totalSatellites).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">avg updates/satellite</p>
          </CardContent>
        </Card>
      </div>

      {/* Satellite Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Satellite Types Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {satelliteTypes.map((type, index) => {
              const typeCount = data.filter(s => s.type === type).length;
              const totalTypeUpdates = data.filter(s => s.type === type).reduce((sum, s) => sum + s.updateCount, 0);
              const typeColors = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'satellite-existing'];
              const colorClass = typeColors[index % typeColors.length];
              
              return (
                <div key={type} className={`p-4 border-l-4 border-l-${colorClass} bg-gradient-to-r from-card to-card/50 rounded-lg hover:shadow-md transition-shadow`}>
                  <div className={`text-lg font-bold text-${colorClass}`}>{typeCount}</div>
                  <div className="text-sm font-medium text-foreground">{type}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {totalTypeUpdates} total updates
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