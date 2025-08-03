import React, { createContext, useContext, useState } from 'react';

const SatelliteContext = createContext(undefined);

export const useSatelliteContext = () => {
  const context = useContext(SatelliteContext);
  if (!context) {
    throw new Error('useSatelliteContext must be used within a SatelliteProvider');
  }
  return context;
};

export const SatelliteProvider = ({ children }) => {
  const [tleData, setTleData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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