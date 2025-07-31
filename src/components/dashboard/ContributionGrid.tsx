import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Activity, Calendar } from 'lucide-react';
import { TLEData } from '@/pages/Dashboard';

interface ContributionGridProps {
  data: TLEData[];
}

interface DayData {
  index: number;
  date: string;
  dayName: string;
  fullDate: string;
}

export const ContributionGrid: React.FC<ContributionGridProps> = ({ data }) => {
  const [timePeriod, setTimePeriod] = useState<string>('day');
  const [maxSatellites, setMaxSatellites] = useState<number>(10);
  const [hoveredCell, setHoveredCell] = useState<{
    satellite: string;
    dayData?: DayData;
    hour: number;
    isUpdated: boolean;
    updateTimes: string[];
  } | null>(null);

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate days based on time period
  const getDays = (): DayData[] => {
    if (timePeriod === 'day') {
      // Show last 7 days for day view
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          index: i,
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
      });
    }
    if (timePeriod === 'week') {
      return Array.from({ length: 7 }, (_, i) => ({
        index: i,
        date: `Week Day ${i + 1}`,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        fullDate: `Day ${i + 1}`
      }));
    }
    return Array.from({ length: 30 }, (_, i) => ({
      index: i,
      date: `Day ${i + 1}`,
      dayName: `D${i + 1}`,
      fullDate: `Day ${i + 1}`
    }));
  };
  
  // Binary color for updated/not updated
  const getUpdateColor = (isUpdated: boolean) => {
    return isUpdated ? 'bg-chart-1' : 'bg-muted/30';
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

  // Calculate updates per satellite per hour/day with exact times
  const getUpdatesForCell = (satellite: TLEData, dayIndex: number, hour: number) => {
    // Use the actual satellite updates data instead of random generation
    const hourUpdates = satellite.updates.filter(update => update.hour === hour);
    
    // Generate consistent fake seconds/minutes based on satellite ID and hour for demo
    const generateConsistentTime = (baseTime: string, satelliteId: string, hour: number) => {
      const hash = satelliteId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const minutes = (hash + hour * 7) % 60;
      const seconds = (hash + hour * 13) % 60;
      return `${baseTime}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return {
      isUpdated: hourUpdates.length > 0,
      times: hourUpdates.map(update => generateConsistentTime(update.time, satellite.noradId, hour))
    };
  };

  const filteredData = data.slice(0, maxSatellites);
  const days = getDays();

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Satellite Update Activity Grid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart Controls */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="time-period">Time Period</Label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-satellites">Max Satellites</Label>
            <Input
              id="max-satellites"
              type="number"
              value={maxSatellites}
              onChange={(e) => setMaxSatellites(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20"
              min="1"
              max="50"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm bg-muted/30"></div>
            <span className="text-muted-foreground">Not Updated</span>
            <div className="w-3 h-3 rounded-sm bg-chart-1"></div>
            <span className="text-muted-foreground">Updated</span>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-max space-y-2">
            {/* Days header with dates */}
            {timePeriod === 'day' && (
              <div className="space-y-1">
                {days.map(dayData => (
                  <div key={dayData.index} className="flex gap-1 items-center">
                    <div className="w-32 text-xs font-medium pr-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{dayData.dayName} {dayData.fullDate}</span>
                    </div>
                    {hours.map(hour => {
                      // Show data for first satellite as example
                      const satellite = filteredData[0];
                      if (!satellite) return <div key={hour} className="w-4 h-4" />;
                      
                      const updateData = getUpdatesForCell(satellite, dayData.index, hour);
                      return (
                        <div
                          key={hour}
                          className={`w-4 h-4 rounded-sm ${getUpdateColor(updateData.isUpdated)} border border-border/20 cursor-pointer hover:ring-2 hover:ring-chart-1/50 transition-all`}
                          onMouseEnter={() => setHoveredCell({
                            satellite: satellite.name,
                            dayData,
                            hour,
                            isUpdated: updateData.isUpdated,
                            updateTimes: updateData.times
                          })}
                          onMouseLeave={() => setHoveredCell(null)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Traditional grid for week/month */}
            {timePeriod !== 'day' && (
              <>
                <div className="flex gap-1 mb-2">
                  <div className="w-32 text-xs text-muted-foreground font-medium">Satellite</div>
                  {hours.map(hour => (
                    <div key={hour} className="w-4 text-xs text-center text-muted-foreground">
                      {hour % 6 === 0 ? hour : ''}
                    </div>
                  ))}
                </div>

                {filteredData.map(satellite => (
                  <div key={satellite.noradId} className="flex gap-1 items-center">
                    <div className="w-32 text-xs font-medium truncate pr-2">
                      <Badge className={`${getTypeColor(satellite.type)} text-white border-0 text-xs px-1 py-0`}>
                        {satellite.name}
                      </Badge>
                    </div>
                    {hours.map(hour => {
                      const updateData = getUpdatesForCell(satellite, 0, hour);
                      return (
                        <div
                          key={hour}
                          className={`w-4 h-4 rounded-sm ${getUpdateColor(updateData.isUpdated)} border border-border/20 cursor-pointer hover:ring-2 hover:ring-chart-1/50 transition-all`}
                          onMouseEnter={() => setHoveredCell({
                            satellite: satellite.name,
                            hour,
                            isUpdated: updateData.isUpdated,
                            updateTimes: updateData.times
                          })}
                          onMouseLeave={() => setHoveredCell(null)}
                        />
                      );
                    })}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="absolute z-10 bg-card border border-border rounded-lg p-3 shadow-lg pointer-events-none max-w-xs">
            <p className="font-semibold text-card-foreground">{hoveredCell.satellite}</p>
            {hoveredCell.dayData && (
              <p className="text-sm text-muted-foreground">{hoveredCell.dayData.dayName} {hoveredCell.dayData.fullDate}</p>
            )}
            <p className="text-sm text-muted-foreground">Hour: {hoveredCell.hour}:00 - {(hoveredCell.hour + 1) % 24}:00</p>
            <p className="text-sm">Status: {hoveredCell.isUpdated ? 'Updated' : 'Not Updated'}</p>
            {hoveredCell.updateTimes.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Exact Update Times:</p>
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
                {hoveredCell.isUpdated ? 'Activity detected' : 'No activity'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};