import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Github, Activity, Calendar, Satellite } from 'lucide-react';
import { TLEData } from '@/pages/Dashboard';

interface ContributionGridProps {
  data: TLEData[];
  isSingleSatellite?: boolean;
}

interface DayData {
  index: number;
  date: string;
  dayName: string;
  fullDate: string;
}

interface WeekData {
  weekNumber: number;
  days: DayData[];
}

export const ContributionGrid: React.FC<ContributionGridProps> = ({ data, isSingleSatellite = false }) => {
  const [timePeriod, setTimePeriod] = useState<string>('day');
  const [maxSatellites, setMaxSatellites] = useState<number>(10);
  const [hoveredCell, setHoveredCell] = useState<{
    satellite: string;
    dayData?: DayData;
    weekData?: WeekData;
    hour: number;
    isUpdated: boolean;
    updateTimes: string[];
    tleString?: string;
  } | null>(null);

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate days and weeks based on time period
  const getDays = (): DayData[] => {
    if (timePeriod === 'day') {
      // Show current day only
      const today = new Date();
      return [{
        index: 0,
        date: today.toISOString().split('T')[0],
        dayName: today.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }];
    }
    if (timePeriod === 'week') {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          index: i,
          date: date.toISOString().split('T')[0],
          dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
      });
    }
    // For month view, create 4 weeks
    const weeks: DayData[] = [];
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date();
        date.setDate(date.getDate() - ((3 - week) * 7) + day);
        weeks.push({
          index: week * 7 + day,
          date: date.toISOString().split('T')[0],
          dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
    }
    return weeks;
  };

  const getWeeks = (): WeekData[] => {
    const days = getDays();
    const weeks: WeekData[] = [];
    for (let i = 0; i < 4; i++) {
      weeks.push({
        weekNumber: i + 1,
        days: days.slice(i * 7, (i + 1) * 7)
      });
    }
    return weeks;
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

    // Generate mock TLE string for hover tooltip
    const generateTLEString = (satelliteId: string) => {
      return `1 ${satelliteId}U 98067A   24001.50000000  .00000000  00000-0  00000-0 0  0000\n2 ${satelliteId}  51.6000   0.0000 0000000   0.0000   0.0000 15.50000000000000`;
    };
    
    return {
      isUpdated: hourUpdates.length > 0,
      times: hourUpdates.map(update => generateConsistentTime(update.time, satellite.noradId, hour)),
      tleString: generateTLEString(satellite.noradId)
    };
  };

  const filteredData = isSingleSatellite ? data : data.slice(0, maxSatellites);
  const days = getDays();
  const weeks = getWeeks();

  // Render single satellite grids for week/month view
  const renderSatelliteGrid = (satellite: TLEData, satelliteIndex: number) => {
    if (timePeriod === 'day') {
      return (
        <div key={satellite.noradId} className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Satellite className="h-4 w-4 text-chart-1" />
            <Badge className={`${getTypeColor(satellite.type)} text-white border-0 text-sm px-2 py-1`}>
              {satellite.name}
            </Badge>
          </div>
          <div className="flex gap-1">
            {hours.map(hour => {
              const updateData = getUpdatesForCell(satellite, 0, hour);
              return (
                <HoverCard key={hour}>
                  <HoverCardTrigger asChild>
                    <div
                      className={`w-6 h-6 rounded-sm ${getUpdateColor(updateData.isUpdated)} border border-border/20 cursor-pointer hover:ring-2 hover:ring-chart-1/50 transition-all flex items-center justify-center text-xs font-medium`}
                    >
                      {hour}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{satellite.name}</h4>
                      <p className="text-sm text-muted-foreground">Hour: {hour}:00 - {(hour + 1) % 24}:00</p>
                      <p className="text-sm">Status: {updateData.isUpdated ? 'Updated' : 'Not Updated'}</p>
                      {updateData.times.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-1">Update Times:</p>
                          <div className="flex flex-wrap gap-1">
                            {updateData.times.map((time, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {updateData.tleString && (
                        <div>
                          <p className="text-xs font-medium mb-1">TLE String:</p>
                          <pre className="text-xs bg-muted p-2 rounded text-muted-foreground whitespace-pre-wrap">
                            {updateData.tleString}
                          </pre>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>
        </div>
      );
    }

    if (timePeriod === 'week') {
      return (
        <div key={satellite.noradId} className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <Satellite className="h-4 w-4 text-chart-1" />
            <Badge className={`${getTypeColor(satellite.type)} text-white border-0 text-sm px-2 py-1`}>
              {satellite.name}
            </Badge>
          </div>
          <div className="space-y-1">
            {days.map(dayData => (
              <div key={dayData.index} className="flex gap-1 items-center">
                <div className="w-24 text-xs font-medium pr-2">
                  <span>{dayData.dayName} {dayData.fullDate}</span>
                </div>
                {hours.map(hour => {
                  const updateData = getUpdatesForCell(satellite, dayData.index, hour);
                  return (
                    <HoverCard key={hour}>
                      <HoverCardTrigger asChild>
                        <div
                          className={`w-4 h-4 rounded-sm ${getUpdateColor(updateData.isUpdated)} border border-border/20 cursor-pointer hover:ring-2 hover:ring-chart-1/50 transition-all`}
                        />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{satellite.name}</h4>
                          <p className="text-sm text-muted-foreground">{dayData.dayName} {dayData.fullDate}</p>
                          <p className="text-sm text-muted-foreground">Hour: {hour}:00 - {(hour + 1) % 24}:00</p>
                          <p className="text-sm">Status: {updateData.isUpdated ? 'Updated' : 'Not Updated'}</p>
                          {updateData.times.length > 0 && (
                            <div>
                              <p className="text-xs font-medium mb-1">Update Times:</p>
                              <div className="flex flex-wrap gap-1">
                                {updateData.times.map((time, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {time}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {updateData.tleString && (
                            <div>
                              <p className="text-xs font-medium mb-1">TLE String:</p>
                              <pre className="text-xs bg-muted p-2 rounded text-muted-foreground whitespace-pre-wrap">
                                {updateData.tleString}
                              </pre>
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (timePeriod === 'month') {
      return (
        <div key={satellite.noradId} className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <Satellite className="h-4 w-4 text-chart-1" />
            <Badge className={`${getTypeColor(satellite.type)} text-white border-0 text-sm px-2 py-1`}>
              {satellite.name}
            </Badge>
          </div>
          <div className="space-y-1">
            {weeks.map(weekData => (
              <div key={weekData.weekNumber} className="flex gap-1 items-center">
                <div className="w-24 text-xs font-medium pr-2">
                  <span>Week {weekData.weekNumber}</span>
                </div>
                {hours.map(hour => {
                  const updateData = getUpdatesForCell(satellite, weekData.weekNumber - 1, hour);
                  return (
                    <HoverCard key={hour}>
                      <HoverCardTrigger asChild>
                        <div
                          className={`w-4 h-4 rounded-sm ${getUpdateColor(updateData.isUpdated)} border border-border/20 cursor-pointer hover:ring-2 hover:ring-chart-1/50 transition-all`}
                        />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{satellite.name}</h4>
                          <p className="text-sm text-muted-foreground">Week {weekData.weekNumber}</p>
                          <p className="text-sm text-muted-foreground">Hour: {hour}:00 - {(hour + 1) % 24}:00</p>
                          <p className="text-sm">Status: {updateData.isUpdated ? 'Updated' : 'Not Updated'}</p>
                          {updateData.times.length > 0 && (
                            <div>
                              <p className="text-xs font-medium mb-1">Update Times:</p>
                              <div className="flex flex-wrap gap-1">
                                {updateData.times.map((time, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {time}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {updateData.tleString && (
                            <div>
                              <p className="text-xs font-medium mb-1">TLE String:</p>
                              <pre className="text-xs bg-muted p-2 rounded text-muted-foreground whitespace-pre-wrap">
                                {updateData.tleString}
                              </pre>
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
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
          
          {!isSingleSatellite && (
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
          )}

          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm bg-muted/30"></div>
            <span className="text-muted-foreground">Not Updated</span>
            <div className="w-3 h-3 rounded-sm bg-chart-1"></div>
            <span className="text-muted-foreground">Updated</span>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-max space-y-4">
            {/* Dashboard view - different layouts for different time periods */}
            {!isSingleSatellite && timePeriod === 'day' && (
              <div className="space-y-2">
                <div className="flex gap-1 mb-2">
                  <div className="w-32 text-xs text-muted-foreground font-medium">Satellite</div>
                  {hours.map(hour => (
                    <div key={hour} className="w-6 text-xs text-center text-muted-foreground">
                      {hour % 4 === 0 ? hour : ''}
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
                        <HoverCard key={hour}>
                          <HoverCardTrigger asChild>
                            <div
                              className={`w-6 h-6 rounded-sm ${getUpdateColor(updateData.isUpdated)} border border-border/20 cursor-pointer hover:ring-2 hover:ring-chart-1/50 transition-all`}
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-semibold">{satellite.name}</h4>
                              <p className="text-sm text-muted-foreground">Hour: {hour}:00 - {(hour + 1) % 24}:00</p>
                              <p className="text-sm">Status: {updateData.isUpdated ? 'Updated' : 'Not Updated'}</p>
                              {updateData.times.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium mb-1">Update Times:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {updateData.times.map((time, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {time}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {updateData.tleString && (
                                <div>
                                  <p className="text-xs font-medium mb-1">TLE String:</p>
                                  <pre className="text-xs bg-muted p-2 rounded text-muted-foreground whitespace-pre-wrap">
                                    {updateData.tleString}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Single satellite grids for week/month OR all layouts for single satellite view */}
            {(isSingleSatellite || timePeriod !== 'day') && (
              <div className="space-y-6">
                {filteredData.map((satellite, index) => renderSatelliteGrid(satellite, index))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};