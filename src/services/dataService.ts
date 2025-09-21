import { 
  ref, 
  onValue, 
  get, 
  set, 
  push, 
  query, 
  orderByChild, 
  limitToLast,
  off,
  DataSnapshot
} from 'firebase/database';
import { database } from '../firebase/config';

export interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  tankLevel: number;
  flowRate: number;
}

// Firebase field mapping
type FirebaseSensorFields = 'SoilMoisture' | 'Temperature' | 'Humidity' | 'TankLevel' | 'FlowRate_LperMin';

export interface ActionLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface SystemLog {
  id: string;
  message: string;
  timestamp: string;
  level: string;
}

export class DataService {
  private static readonly SENSORS_PATH = 'SmartIrrigation/Sensors';
  private static readonly CONTROLS_PATH = 'SmartIrrigation/Controls';
  private static readonly ACTIONS_PATH = 'SmartIrrigation/Actions';
  private static readonly LOGS_PATH = 'SmartIrrigation/Logs';

  // Default sensor data
  private static readonly DEFAULT_SENSOR_DATA: SensorData = {
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    tankLevel: 0,
    flowRate: 0
  };

  // Validation ranges for sensor data
  private static readonly VALIDATION_RANGES = {
    soilMoisture: { min: 0, max: 100 },
    temperature: { min: -50, max: 100 },
    humidity: { min: 0, max: 100 },
    tankLevel: { min: 0, max: 100 },
    flowRate: { min: 0, max: 1000 }
  };

  /**
   * Parse and validate sensor data
   */
  private static parseAndValidateSensorValue(
    data: any, 
    key: FirebaseSensorFields
  ): number {
    if (!data || data[key] === null || data[key] === undefined) {
      // Map Firebase field to SensorData field
      const sensorKey = this.mapFirebaseToSensorData(key);
      return this.DEFAULT_SENSOR_DATA[sensorKey];
    }

    const value = parseFloat(data[key]);
    if (isNaN(value)) {
      const sensorKey = this.mapFirebaseToSensorData(key);
      return this.DEFAULT_SENSOR_DATA[sensorKey];
    }

    // Validate range
    const sensorKey = this.mapFirebaseToSensorData(key);
    const range = this.VALIDATION_RANGES[sensorKey];
    if (range) {
      return Math.max(range.min, Math.min(range.max, value));
    }

    return value;
  }

  /**
   * Map Firebase field names to SensorData keys
   */
  private static mapFirebaseToSensorData(firebaseKey: FirebaseSensorFields): keyof SensorData {
    const mapping: Record<FirebaseSensorFields, keyof SensorData> = {
      'SoilMoisture': 'soilMoisture',
      'Temperature': 'temperature',
      'Humidity': 'humidity',
      'TankLevel': 'tankLevel',
      'FlowRate_LperMin': 'flowRate'
    };
    return mapping[firebaseKey];
  }

  /**
   * Get real-time sensor data stream
   */
  static getSensorDataStream(callback: (data: SensorData) => void): () => void {
    const sensorsRef = ref(database, this.SENSORS_PATH);
    
    const handleData = (snapshot: DataSnapshot) => {
      try {
        const data = snapshot.val();
        const sensorData: SensorData = {
          soilMoisture: this.parseAndValidateSensorValue(data, 'SoilMoisture'),
          temperature: this.parseAndValidateSensorValue(data, 'Temperature'),
          humidity: this.parseAndValidateSensorValue(data, 'Humidity'),
          tankLevel: this.parseAndValidateSensorValue(data, 'TankLevel'),
          flowRate: this.parseAndValidateSensorValue(data, 'FlowRate_LperMin')
        };
        callback(sensorData);
      } catch (error) {
        console.error('Error parsing sensor data:', error);
        callback(this.DEFAULT_SENSOR_DATA);
      }
    };

    onValue(sensorsRef, handleData);

    // Return unsubscribe function
    return () => off(sensorsRef, 'value', handleData);
  }

  /**
   * Get sensor data once
   */
  static async getSensorData(): Promise<SensorData> {
    try {
      const sensorsRef = ref(database, this.SENSORS_PATH);
      const snapshot = await get(sensorsRef);
      const data = snapshot.val();

      if (!data) {
        return this.DEFAULT_SENSOR_DATA;
      }

      return {
        soilMoisture: this.parseAndValidateSensorValue(data, 'SoilMoisture'),
        temperature: this.parseAndValidateSensorValue(data, 'Temperature'),
        humidity: this.parseAndValidateSensorValue(data, 'Humidity'),
        tankLevel: this.parseAndValidateSensorValue(data, 'TankLevel'),
        flowRate: this.parseAndValidateSensorValue(data, 'FlowRate_LperMin')
      };
    } catch (error) {
      console.error('Error getting sensor data:', error);
      return this.DEFAULT_SENSOR_DATA;
    }
  }

  /**
   * Get real-time pump state stream
   */
  static getPumpStateStream(callback: (state: string) => void): () => void {
    const pumpRef = ref(database, `${this.CONTROLS_PATH}/Pump`);
    
    const handleData = (snapshot: DataSnapshot) => {
      try {
        const state = snapshot.val();
        callback(state || 'OFF');
      } catch (error) {
        console.error('Error parsing pump state:', error);
        callback('OFF');
      }
    };

    onValue(pumpRef, handleData);

    // Return unsubscribe function
    return () => off(pumpRef, 'value', handleData);
  }

  /**
   * Get pump state once
   */
  static async getPumpState(): Promise<string> {
    try {
      const pumpRef = ref(database, `${this.CONTROLS_PATH}/Pump`);
      const snapshot = await get(pumpRef);
      return snapshot.val() || 'OFF';
    } catch (error) {
      console.error('Error getting pump state:', error);
      return 'OFF';
    }
  }

  /**
   * Set pump state
   */
  static async setPumpState(state: 'ON' | 'OFF'): Promise<boolean> {
    try {
      if (state !== 'ON' && state !== 'OFF') {
        throw new Error('Pump state must be ON or OFF');
      }

      const pumpRef = ref(database, `${this.CONTROLS_PATH}/Pump`);
      await set(pumpRef, state);

      // Log the action
      await this.logAction(`Pump:${state}`);

      return true;
    } catch (error) {
      console.error('Error setting pump state:', error);
      return false;
    }
  }

  /**
   * Get action logs
   */
  static async getActionLogs(limit: number = 30): Promise<ActionLog[]> {
    try {
      const actionsRef = ref(database, this.ACTIONS_PATH);
      const actionsQuery = query(
        actionsRef,
        orderByChild('timestamp'),
        limitToLast(limit)
      );
      
      const snapshot = await get(actionsQuery);
      const data = snapshot.val();

      if (!data) {
        return [];
      }

      const logs: ActionLog[] = [];
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        logs.push({
          id: key,
          action: value.action || '',
          timestamp: value.timestamp || '',
          user: value.user || 'unknown'
        });
      });

      // Sort by timestamp
      logs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

      return logs;
    } catch (error) {
      console.error('Error getting action logs:', error);
      return [];
    }
  }

  /**
   * Get system logs
   */
  static async getSystemLogs(limit: number = 30): Promise<SystemLog[]> {
    try {
      const logsRef = ref(database, this.LOGS_PATH);
      const logsQuery = query(
        logsRef,
        orderByChild('timestamp'),
        limitToLast(limit)
      );
      
      const snapshot = await get(logsQuery);
      const data = snapshot.val();

      if (!data) {
        return [];
      }

      const logs: SystemLog[] = [];
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        logs.push({
          id: key,
          message: value.message || '',
          timestamp: value.timestamp || '',
          level: value.level || 'info'
        });
      });

      // Sort by timestamp
      logs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

      return logs;
    } catch (error) {
      console.error('Error getting system logs:', error);
      return [];
    }
  }

  /**
   * Log an action
   */
  private static async logAction(action: string): Promise<void> {
    try {
      const actionsRef = ref(database, this.ACTIONS_PATH);
      const newActionRef = push(actionsRef);
      
      await set(newActionRef, {
        action,
        timestamp: new Date().toISOString(),
        user: 'web_app' // In a real app, this would be the authenticated user
      });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }

  /**
   * Check Firebase connection status
   */
  static async checkConnection(): Promise<boolean> {
    try {
      const connectedRef = ref(database, '.info/connected');
      const snapshot = await get(connectedRef);
      return snapshot.val() === true;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }
}
