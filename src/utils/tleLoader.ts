/**
 * TLE file loading and parsing utilities for date-based folder structure
 */

import { parseTLEEpoch, compareTLEStrings, extractNoradId, validateTLE } from './tleUtils';

export interface TLEFileData {
  filename: string;
  content: string;
  timestamp: Date;
  hour: number;
  minute: number;
  second: number;
}

export interface SatelliteTLE {
  noradId: string;
  name: string;
  line1: string;
  line2: string;
  epochTime: Date;
  filename: string;
}

export interface ParsedTLEComparison {
  noradId: string;
  name: string;
  type: string;
  updates: Array<{
    epochTime: Date;
    tleLine1: string;
    tleLine2: string;
    hour: number;
    date: string;
    time: string;
    filename: string;
  }>;
  updateCount: number;
  lastUpdated: string;
  epoch: string;
  inclination: number;
  eccentricity: number;
  meanMotion: number;
}

/**
 * Generate date range between two dates
 */
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Parse time from filename (tle_HHMMSS.txt)
 */
function parseTimeFromFilename(filename: string): { hour: number; minute: number; second: number } | null {
  const match = filename.match(/tle_(\d{2})(\d{2})(\d{2})\.txt$/);
  if (!match) return null;
  
  return {
    hour: parseInt(match[1]),
    minute: parseInt(match[2]),
    second: parseInt(match[3])
  };
}

/**
 * Load TLE files from a specific date folder
 */
async function loadTLEFilesFromDate(date: string): Promise<TLEFileData[]> {
  const files: TLEFileData[] = [];
  
  try {
    // Try to load an index file that lists available TLE files for this date
    const indexResponse = await fetch(`/tle-data/${date}/index.json`);
    let filenames: string[] = [];
    
    if (indexResponse.ok) {
      const indexData = await indexResponse.json();
      filenames = indexData.files || [];
    } else {
      // Fallback: try common time patterns
      const commonTimes = [
        '000000', '060000', '120000', '180000', // Every 6 hours
        '013008', '073008', '133008', '193008', // Common update times
      ];
      
      for (const time of commonTimes) {
        const filename = `tle_${time}.txt`;
        try {
          const response = await fetch(`/tle-data/${date}/${filename}`);
          if (response.ok) {
            filenames.push(filename);
          }
        } catch {
          // File doesn't exist, continue
        }
      }
    }
    
    // Load each TLE file
    for (const filename of filenames) {
      try {
        const response = await fetch(`/tle-data/${date}/${filename}`);
        if (response.ok) {
          const content = await response.text();
          const timeInfo = parseTimeFromFilename(filename);
          
          if (timeInfo) {
            const timestamp = new Date(date);
            timestamp.setHours(timeInfo.hour, timeInfo.minute, timeInfo.second);
            
            files.push({
              filename,
              content,
              timestamp,
              hour: timeInfo.hour,
              minute: timeInfo.minute,
              second: timeInfo.second
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to load ${filename} from ${date}:`, error);
      }
    }
  } catch (error) {
    console.warn(`Failed to load TLE files from ${date}:`, error);
  }
  
  return files.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Parse TLE content to extract individual satellites
 */
function parseTLEContent(content: string, filename: string): SatelliteTLE[] {
  const lines = content.trim().split('\n').filter(line => line.trim());
  const satellites: SatelliteTLE[] = [];
  
  for (let i = 0; i < lines.length; i += 3) {
    if (i + 2 >= lines.length) break;
    
    const name = lines[i].trim();
    const line1 = lines[i + 1].trim();
    const line2 = lines[i + 2].trim();
    
    if (validateTLE(line1, line2)) {
      const noradId = extractNoradId(line1);
      const epochInfo = parseTLEEpoch(line1);
      
      satellites.push({
        noradId,
        name,
        line1,
        line2,
        epochTime: epochInfo.date,
        filename
      });
    }
  }
  
  return satellites;
}

/**
 * Classify satellite type based on name patterns
 */
function classifySatelliteType(name: string): string {
  const upperName = name.toUpperCase();
  
  if (upperName.includes('STARLINK')) return 'Communication';
  if (upperName.includes('ISS') || upperName.includes('ZARYA')) return 'Space Station';
  if (upperName.includes('COSMOS') || upperName.includes('MILITARY')) return 'Military';
  if (upperName.includes('GPS') || upperName.includes('GLONASS') || upperName.includes('GALILEO')) return 'Navigation';
  if (upperName.includes('LANDSAT') || upperName.includes('SENTINEL') || upperName.includes('TERRA')) return 'Earth Observation';
  if (upperName.includes('HUBBLE') || upperName.includes('CHANDRA') || upperName.includes('SPITZER')) return 'Scientific';
  if (upperName.includes('WEATHER') || upperName.includes('NOAA') || upperName.includes('GOES')) return 'Weather';
  
  return 'Other';
}

/**
 * Extract orbital parameters from TLE
 */
function extractOrbitalParameters(line1: string, line2: string) {
  // Parse orbital elements from TLE Line 2
  const inclination = parseFloat(line2.substring(8, 16));
  const raan = parseFloat(line2.substring(17, 25));
  const eccentricity = parseFloat('0.' + line2.substring(26, 33));
  const argPerigee = parseFloat(line2.substring(34, 42));
  const meanAnomaly = parseFloat(line2.substring(43, 51));
  const meanMotion = parseFloat(line2.substring(52, 63));
  
  return {
    inclination,
    raan,
    eccentricity,
    argPerigee,
    meanAnomaly,
    meanMotion
  };
}

/**
 * Main function to load and compare TLE data based on date range
 */
export async function loadAndCompareTLEData(fromDate: string, toDate: string): Promise<ParsedTLEComparison[]> {
  const dates = generateDateRange(fromDate, toDate);
  const allSatelliteData = new Map<string, SatelliteTLE[]>();
  
  // Load all TLE files from date range
  for (const date of dates) {
    const files = await loadTLEFilesFromDate(date);
    
    for (const file of files) {
      const satellites = parseTLEContent(file.content, file.filename);
      
      for (const satellite of satellites) {
        if (!allSatelliteData.has(satellite.noradId)) {
          allSatelliteData.set(satellite.noradId, []);
        }
        allSatelliteData.get(satellite.noradId)!.push(satellite);
      }
    }
  }
  
  // Process each satellite's data to find real updates
  const comparisonResults: ParsedTLEComparison[] = [];
  
  for (const [noradId, satelliteEntries] of allSatelliteData) {
    if (satelliteEntries.length === 0) continue;
    
    // Sort by epoch time
    satelliteEntries.sort((a, b) => a.epochTime.getTime() - b.epochTime.getTime());
    
    const updates: ParsedTLEComparison['updates'] = [];
    let previousTLE: { line1: string; line2: string } | null = null;
    
    for (const entry of satelliteEntries) {
      // Compare with previous TLE to detect real changes
      const isUpdate = !previousTLE || 
        !compareTLEStrings(previousTLE.line1, previousTLE.line2, entry.line1, entry.line2);
      
      if (isUpdate) {
        const epochInfo = parseTLEEpoch(entry.line1);
        
        updates.push({
          epochTime: epochInfo.date,
          tleLine1: entry.line1,
          tleLine2: entry.line2,
          hour: epochInfo.date.getHours(),
          date: epochInfo.date.toISOString().split('T')[0],
          time: epochInfo.date.toTimeString().split(' ')[0],
          filename: entry.filename
        });
        
        previousTLE = { line1: entry.line1, line2: entry.line2 };
      }
    }
    
    if (updates.length > 0) {
      const latestEntry = satelliteEntries[satelliteEntries.length - 1];
      const orbitalParams = extractOrbitalParameters(latestEntry.line1, latestEntry.line2);
      
      comparisonResults.push({
        noradId,
        name: latestEntry.name,
        type: classifySatelliteType(latestEntry.name),
        updates,
        updateCount: updates.length,
        lastUpdated: updates[updates.length - 1].epochTime.toISOString(),
        epoch: updates[updates.length - 1].date,
        inclination: orbitalParams.inclination,
        eccentricity: orbitalParams.eccentricity,
        meanMotion: orbitalParams.meanMotion
      });
    }
  }
  
  return comparisonResults.sort((a, b) => b.updateCount - a.updateCount);
}