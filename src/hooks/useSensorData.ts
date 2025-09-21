import { useState, useEffect, useCallback } from 'react';
import { DataService, SensorData } from '../services/dataService';

export interface SensorDataState {
  data: SensorData;
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export const useSensorData = () => {
  const [sensorState, setSensorState] = useState<SensorDataState>({
    data: {
      soilMoisture: 0,
      temperature: 0,
      humidity: 0,
      tankLevel: 0,
      flowRate: 0
    },
    loading: true,
    error: null,
    connected: false
  });

  const updateSensorData = useCallback((newData: SensorData) => {
    setSensorState(prev => ({
      ...prev,
      data: newData,
      loading: false,
      error: null
    }));
  }, []);

  const handleError = useCallback((error: string) => {
    setSensorState(prev => ({
      ...prev,
      loading: false,
      error
    }));
  }, []);

  const updateConnectionStatus = useCallback((connected: boolean) => {
    setSensorState(prev => ({
      ...prev,
      connected
    }));
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeData = async () => {
      try {
        // Check connection status
        const connected = await DataService.checkConnection();
        updateConnectionStatus(connected);

        // Get initial data
        const initialData = await DataService.getSensorData();
        updateSensorData(initialData);

        // Set up real-time listener
        unsubscribe = DataService.getSensorDataStream(updateSensorData);
      } catch (error) {
        handleError('Failed to initialize sensor data');
        console.error('Error initializing sensor data:', error);
      }
    };

    initializeData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [updateSensorData, handleError, updateConnectionStatus]);

  return {
    ...sensorState,
    refreshData: async () => {
      try {
        setSensorState(prev => ({ ...prev, loading: true, error: null }));
        const data = await DataService.getSensorData();
        updateSensorData(data);
      } catch (error) {
        handleError('Failed to refresh sensor data');
      }
    }
  };
};
