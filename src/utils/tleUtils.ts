/**
 * TLE (Two-Line Element) parsing and comparison utilities
 */

export interface ParsedEpoch {
  year: number;
  dayOfYear: number;
  fractionalDay: number;
  date: Date;
}

/**
 * Parse TLE epoch from Line 1
 * Format: YYDDD.DDDDDDDD where YY is year, DDD is day of year, and DDDDDDDD is fractional day
 */
export function parseTLEEpoch(tleLine1: string): ParsedEpoch {
  // Extract epoch from positions 18-32 of TLE Line 1
  const epochString = tleLine1.substring(18, 32);
  
  // Parse year (YY format)
  const yearTwoDigit = parseInt(epochString.substring(0, 2));
  const year = yearTwoDigit < 57 ? 2000 + yearTwoDigit : 1900 + yearTwoDigit;
  
  // Parse day of year and fractional day
  const dayOfYear = parseInt(epochString.substring(2, 5));
  const fractionalDay = parseFloat(epochString.substring(5));
  
  // Convert to actual date
  const date = new Date(year, 0, 1); // Start with January 1st
  date.setDate(date.getDate() + dayOfYear - 1); // Add days (subtract 1 because Jan 1 is day 1)
  
  // Add fractional day (hours, minutes, seconds)
  const totalSeconds = fractionalDay * 24 * 60 * 60;
  date.setSeconds(date.getSeconds() + totalSeconds);
  
  return {
    year,
    dayOfYear,
    fractionalDay,
    date
  };
}

/**
 * Compare two TLE strings to check if they are identical
 * Only compares Line 1 and Line 2 content (ignoring whitespace)
 */
export function compareTLEStrings(tle1Line1: string, tle1Line2: string, tle2Line1: string, tle2Line2: string): boolean {
  const normalize = (line: string) => line.trim().replace(/\s+/g, ' ');
  
  return normalize(tle1Line1) === normalize(tle2Line1) && 
         normalize(tle1Line2) === normalize(tle2Line2);
}

/**
 * Extract NORAD ID from TLE Line 1
 */
export function extractNoradId(tleLine1: string): string {
  return tleLine1.substring(2, 7).trim();
}

/**
 * Format epoch date for display
 */
export function formatEpochTime(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

/**
 * Validate TLE format
 */
export function validateTLE(line1: string, line2: string): boolean {
  // Basic TLE format validation
  if (line1.length !== 69 || line2.length !== 69) return false;
  if (!line1.startsWith('1 ') || !line2.startsWith('2 ')) return false;
  
  // Check if NORAD IDs match
  const noradId1 = extractNoradId(line1);
  const noradId2 = line2.substring(2, 7).trim();
  
  return noradId1 === noradId2;
}