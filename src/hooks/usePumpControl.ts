import { useState, useEffect, useCallback } from 'react';
import { DataService } from '../services/dataService';

export interface PumpControlState {
  pumpStatus: 'ON' | 'OFF';
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export const usePumpControl = () => {
  const [pumpState, setPumpState] = useState<PumpControlState>({
    pumpStatus: 'OFF',
    loading: true,
    error: null,
    connected: false
  });

  const updatePumpStatus = useCallback((status: 'ON' | 'OFF') => {
    setPumpState(prev => ({
      ...prev,
      pumpStatus: status,
      loading: false,
      error: null
    }));
  }, []);

  const handleError = useCallback((error: string) => {
    setPumpState(prev => ({
      ...prev,
      loading: false,
      error
    }));
  }, []);

  const updateConnectionStatus = useCallback((connected: boolean) => {
    setPumpState(prev => ({
      ...prev,
      connected
    }));
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializePumpControl = async () => {
      try {
        // Check connection status
        const connected = await DataService.checkConnection();
        updateConnectionStatus(connected);

        // Get initial pump state
        const initialStatus = await DataService.getPumpState();
        updatePumpStatus(initialStatus as 'ON' | 'OFF');

        // Set up real-time listener
        unsubscribe = DataService.getPumpStateStream(updatePumpStatus);
      } catch (error) {
        handleError('Failed to initialize pump control');
        console.error('Error initializing pump control:', error);
      }
    };

    initializePumpControl();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [updatePumpStatus, handleError, updateConnectionStatus]);

  const togglePump = useCallback(async () => {
    try {
      setPumpState(prev => ({ ...prev, loading: true, error: null }));
      
      const newStatus = pumpState.pumpStatus === 'ON' ? 'OFF' : 'ON';
      const success = await DataService.setPumpState(newStatus);
      
      if (success) {
        updatePumpStatus(newStatus);
      } else {
        handleError('Failed to update pump status');
      }
    } catch (error) {
      handleError('Failed to toggle pump');
      console.error('Error toggling pump:', error);
    }
  }, [pumpState.pumpStatus, updatePumpStatus, handleError]);

  const setPumpStatus = useCallback(async (status: 'ON' | 'OFF') => {
    try {
      setPumpState(prev => ({ ...prev, loading: true, error: null }));
      
      const success = await DataService.setPumpState(status);
      
      if (success) {
        updatePumpStatus(status);
      } else {
        handleError('Failed to set pump status');
      }
    } catch (error) {
      handleError('Failed to set pump state');
      console.error('Error setting pump state:', error);
    }
  }, [updatePumpStatus, handleError]);

  return {
    ...pumpState,
    togglePump,
    setPumpStatus,
    refreshStatus: async () => {
      try {
        setPumpState(prev => ({ ...prev, loading: true, error: null }));
        const status = await DataService.getPumpState();
        updatePumpStatus(status as 'ON' | 'OFF');
      } catch (error) {
        handleError('Failed to refresh pump status');
      }
    }
  };
};
