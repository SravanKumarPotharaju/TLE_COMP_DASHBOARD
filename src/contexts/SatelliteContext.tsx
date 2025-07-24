import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TLEData } from '@/pages/Dashboard';

interface SatelliteContextType {
  tleData: TLEData[];
  setTleData: (data: TLEData[]) => void;
  currentFile: File | null;
  setCurrentFile: (file: File | null) => void;
  referenceFile: File | null;
  setReferenceFile: (file: File | null) => void;
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
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);

  return (
    <SatelliteContext.Provider value={{
      tleData,
      setTleData,
      currentFile,
      setCurrentFile,
      referenceFile,
      setReferenceFile
    }}>
      {children}
    </SatelliteContext.Provider>
  );
};