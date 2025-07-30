import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Activity } from 'lucide-react';
import { TLEData } from '@/pages/Dashboard';

interface ContributionGridProps {
  data: TLEData[];
  timePeriod?: string;
}

export const ContributionGrid: React.FC<ContributionGridProps> = ({ data, timePeriod = 'day' }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    satellite: string;
    hour: number;
    updates: number;
    updateTimes: string[];
  } | null>(null);

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Color intensity based on update count
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    if (count <= 2) return 'bg-chart-1/30';
    if (count <= 5) return 'bg-chart-1/60';
    if (count <= 10) return 'bg-chart-1/80';
    return 'bg-chart-1';
  };

  // Get satellite type color
  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      'Communication': 'bg-chart-1',
      'Space Station': 'bg-chart-2',
      'Military': 'bg-chart-3',
      'Scientific': 'bg-chart-4',
      'Earth Observation': 'bg-chart-5',
      'Navigation': 'bg-satellite-existing'
    };
    return typeColors[type] || 'bg-chart-1';
  };

  // Calculate updates per satellite per hour with update times
  const getUpdatesForHour = (satellite: TLEData, hour: number) => {
    const hourUpdates = satellite.updates.filter(update => update.hour === hour);
    return {
      count: hourUpdates.length,
      times: hourUpdates.map(update => update.time)
    };
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Satellite Update Activity Grid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted/30"></div>
            <div className="w-3 h-3 rounded-sm bg-chart-1/30"></div>
            <div className="w-3 h-3 rounded-sm bg-chart-1/60"></div>
            <div className="w-3 h-3 rounded-sm bg-chart-1/80"></div>
            <div className="w-3 h-3 rounded-sm bg-chart-1"></div>
          </div>
          <span className="text-muted-foreground">More</span>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-max space-y-1">
            {/* Hour labels */}
            <div className="flex gap-1 mb-2">
              <div className="w-32 text-xs text-muted-foreground font-medium">Satellite</div>
              {hours.map(hour => (
                <div key={hour} className="w-4 text-xs text-center text-muted-foreground">
                  {hour % 4 === 0 ? hour : ''}
                </div>
              ))}
            </div>

            {/* Satellite rows */}
            {data.slice(0, 10).map(satellite => (
              <div key={satellite.noradId} className="flex gap-1 items-center">
                <div className="w-32 text-xs font-medium truncate pr-2">
                  <Badge 
                    className={`${getTypeColor(satellite.type)} text-white border-0 text-xs px-1 py-0`}
                  >
                    {satellite.name}
                  </Badge>
                </div>
                {hours.map(hour => {
                  const updateData = getUpdatesForHour(satellite, hour);
                  return (
                    <div
                      key={hour}
                      className={`w-4 h-4 rounded-sm ${getIntensityColor(updateData.count)} border border-border/20 cursor-pointer hover:ring-2 hover:ring-chart-1/50 transition-all`}
                      onMouseEnter={() => setHoveredCell({
                        satellite: satellite.name,
                        hour,
                        updates: updateData.count,
                        updateTimes: updateData.times
                      })}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="absolute z-10 bg-card border border-border rounded-lg p-3 shadow-lg pointer-events-none max-w-xs">
            <p className="font-semibold text-card-foreground">{hoveredCell.satellite}</p>
            <p className="text-sm text-muted-foreground">Hour: {hoveredCell.hour}:00 - {(hoveredCell.hour + 1) % 24}:00</p>
            <p className="text-sm">Updates: {hoveredCell.updates}</p>
            {hoveredCell.updateTimes.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Update Times:</p>
                <div className="flex flex-wrap gap-1">
                  {hoveredCell.updateTimes.map((time, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 mt-2">
              <Activity className="h-3 w-3 text-chart-1" />
              <span className="text-xs text-muted-foreground">
                {hoveredCell.updates > 0 ? `${hoveredCell.updates} update${hoveredCell.updates > 1 ? 's' : ''}` : 'No activity'}
              </span>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Each square represents satellite update activity for that hour. Hover to see details.
        </div>
      </CardContent>
    </Card>
  );
};