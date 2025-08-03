import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Loader2 } from 'lucide-react';

export const DateRangeSelector = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onLoad,
  loading
}) => {
  return (
    <Card className="border-2 border-dashed border-border/50 hover:border-chart-1/50 transition-colors bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-chart-1">
          <Calendar className="h-5 w-5" />
          TLE Comparison Date Range
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-date" className="text-sm font-medium">From Date</Label>
            <Input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-date" className="text-sm font-medium">To Date</Label>
            <Input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="cursor-pointer"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onLoad}
            disabled={loading || !fromDate || !toDate}
            className="px-8 py-3 bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing TLE Data...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Load TLE Comparison Data
              </>
            )}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground text-center">
          Select date range to compare TLE files from TLECOMPARISON folder structure
        </div>
      </CardContent>
    </Card>
  );
};