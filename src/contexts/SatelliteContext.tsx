import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TLEData } from '@/pages/Dashboard';

interface SatelliteContextType {
  tleData: TLEData[];
  setTleData: (data: TLEData[]) => void;
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
}

const SatelliteContext = createContext<SatelliteContextType | undefined>(undefined);

export const useSatelliteContext = () => {
  const context = useContext(SatelliteContext);
  if (!context) {
    throw new Error('useSatelliteContext must be used within a SatelliteProvider');
  }
  return context;
};

interface SatelliteProviderProps {
  children: ReactNode;
}

export const SatelliteProvider: React.FC<SatelliteProviderProps> = ({ children }) => {
  const [tleData, setTleData] = useState<TLEData[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  return (
    <SatelliteContext.Provider value={{
      tleData,
      setTleData,
      fromDate,
      setFromDate,
      toDate,
      setToDate
    }}>
      {children}
    </SatelliteContext.Provider>
  );
};