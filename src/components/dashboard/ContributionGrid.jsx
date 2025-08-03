import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Github, Activity, Calendar, Satellite } from 'lucide-react';
import { formatEpochTime } from '@/utils/tleUtils';

export const ContributionGrid = ({ data, isSingleSatellite = false }) => {
  const [timePeriod, setTimePeriod] = useState('day');
  const [maxSatellites, setMaxSatellites] = useState(10);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getDays = () => {
    if (timePeriod === 'day') {
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
    const weeks = [];
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

  const getUpdateColor = (isUpdated) => {
    return isUpdated ? 'bg-chart-1' : 'bg-muted/30';
  };

  const getTypeColor = (type) => {
    const typeColors = {
      'Communication': 'bg-chart-1',
      'Space Station': 'bg-chart-2',
      'Military': 'bg-chart-3',
      'Scientific': 'bg-chart-4',
      'Earth Observation': 'bg-chart-5',
      'Navigation': 'bg-satellite-existing'
    };
    return typeColors[type] || 'bg-chart-1';
  };

  const getUpdatesForCell = (satellite, dayIndex, hour) => {
    const relevantUpdates = satellite.updates.filter(update => {
      const updateDate = new Date(update.epochTime);
      const updateHour = updateDate.getUTCHours();
      
      if (timePeriod === 'day') {
        return updateHour === hour;
      } else if (timePeriod === 'week') {
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - (6 - dayIndex));
        
        return updateDate.toDateString() === targetDate.toDateString() && updateHour === hour;
      }
      
      return false;
    });
    
    return {
      isUpdated: relevantUpdates.length > 0,
      updates: relevantUpdates,
      epochTimes: relevantUpdates.map(update => formatEpochTime(update.epochTime)),
      tleStrings: relevantUpdates.map(update => `${update.tleLine1}\n${update.tleLine2}`)
    };
  };

  const filteredData = isSingleSatellite ? data : data.slice(0, maxSatellites);
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

        <div className="overflow-x-auto">
          <div className="min-w-max space-y-4">
            {filteredData.map(satellite => (
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
                          <div className={`w-6 h-6 rounded-sm ${getUpdateColor(updateData.isUpdated)} border border-border/20 cursor-pointer hover:ring-2 hover:ring-chart-1/50 transition-all flex items-center justify-center text-xs font-medium`}>
                            {hour}
                          </div>
                        </HoverCardTrigger>
                         <HoverCardContent className="w-96">
                           <div className="space-y-2">
                             <h4 className="font-semibold">{satellite.name}</h4>
                             <p className="text-sm text-muted-foreground">Hour: {hour}:00 - {(hour + 1) % 24}:00</p>
                             <p className="text-sm">Status: {updateData.isUpdated ? 'Updated' : 'Not Updated'}</p>
                           </div>
                         </HoverCardContent>
                      </HoverCard>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};