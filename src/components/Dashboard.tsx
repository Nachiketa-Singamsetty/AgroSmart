import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  Battery, 
  Gauge, 
  Power,
  Zap,
  WifiOff,
  Wifi
} from "lucide-react";

interface SensorData {
  soilMoisture: number;
  sunlight: number;
  rainfall: number;
  tankLevel: number;
  phLevel: number;
  pumpStatus: boolean;
  zone1Status: boolean;
  zone2Status: boolean;
  isConnected: boolean;
  lastUpdate: string;
}

export const Dashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    soilMoisture: 65,
    sunlight: 24,
    rainfall: 58,
    tankLevel: 82,
    phLevel: 6.8,
    pumpStatus: false,
    zone1Status: false,
    zone2Status: false,
    isConnected: true,
    lastUpdate: new Date().toLocaleTimeString()
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        soilMoisture: Math.max(30, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 10)),
        sunlight: Math.max(15, Math.min(35, prev.sunlight + (Math.random() - 0.5) * 2)),
        rainfall: Math.max(40, Math.min(90, prev.rainfall + (Math.random() - 0.5) * 5)),
        tankLevel: Math.max(0, Math.min(100, prev.tankLevel + (Math.random() - 0.5) * 3)),
        phLevel: Math.max(5.0, Math.min(8.5, prev.phLevel + (Math.random() - 0.5) * 0.3)),
        lastUpdate: new Date().toLocaleTimeString()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleZone1 = () => {
    setSensorData(prev => {
      const newZone1Status = !prev.zone1Status;
      const newPumpStatus = newZone1Status || prev.zone2Status;
      return {
        ...prev,
        zone1Status: newZone1Status,
        pumpStatus: newPumpStatus
      };
    });
  };

  const toggleZone2 = () => {
    setSensorData(prev => {
      const newZone2Status = !prev.zone2Status;
      const newPumpStatus = prev.zone1Status || newZone2Status;
      return {
        ...prev,
        zone2Status: newZone2Status,
        pumpStatus: newPumpStatus
      };
    });
  };


  const getSoilMoistureColor = (value: number) => {
    if (value < 40) return "text-irrigation-danger";
    if (value < 60) return "text-irrigation-warning";
    return "text-irrigation-success";
  };

  const getTankLevelColor = (value: number) => {
    if (value < 20) return "text-irrigation-danger";
    if (value < 50) return "text-irrigation-warning";
    return "text-irrigation-blue";
  };

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AgroSmart</h1>
          <p className="text-muted-foreground">Real-time monitoring & control</p>
        </div>
        <div className="flex items-center gap-2">
          {sensorData.isConnected ? (
            <Badge variant="secondary" className="bg-irrigation-success/20 text-irrigation-success border-irrigation-success/30">
              <Wifi className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive" className="bg-irrigation-danger/20 text-irrigation-danger border-irrigation-danger/30">
              <WifiOff className="w-3 h-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Soil Moisture */}
        <Card className="shadow-card border-l-4 border-l-irrigation-green">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-irrigation-green" />
                Soil Moisture
              </div>
              <span className={`text-lg font-bold ${getSoilMoistureColor(sensorData.soilMoisture)}`}>
                {sensorData.soilMoisture}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={sensorData.soilMoisture} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {sensorData.soilMoisture < 40 ? "Needs watering" : 
               sensorData.soilMoisture < 60 ? "Moderate" : "Optimal"}
            </p>
          </CardContent>
        </Card>

        {/* Sunlight */}
        <Card className="shadow-card border-l-4 border-l-irrigation-earth">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-irrigation-earth" />
                Sunlight
              </div>
              <span className="text-lg font-bold text-irrigation-earth">
                {sensorData.sunlight}°C
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={((sensorData.sunlight - 15) / 20) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Range: 15°C - 35°C
            </p>
          </CardContent>
        </Card>

        {/* Rainfall */}
        <Card className="shadow-card border-l-4 border-l-irrigation-blue">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-irrigation-blue" />
                Rainfall
              </div>
              <span className="text-lg font-bold text-irrigation-blue">
                {sensorData.rainfall}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={sensorData.rainfall} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Rainfall intensity
            </p>
          </CardContent>
        </Card>

        {/* Tank Level */}
        <Card className="shadow-card border-l-4 border-l-irrigation-blue">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-irrigation-blue" />
                Tank Level
              </div>
              <span className={`text-lg font-bold ${getTankLevelColor(sensorData.tankLevel)}`}>
                {sensorData.tankLevel}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={sensorData.tankLevel} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {sensorData.tankLevel < 20 ? "Low water - Refill needed" : "Water available"}
            </p>
          </CardContent>
        </Card>

        {/* pH Level */}
        <Card className="shadow-card border-l-4 border-l-irrigation-success">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-irrigation-success" />
                pH Level
              </div>
              <span className="text-lg font-bold text-irrigation-success">
                {sensorData.phLevel.toFixed(1)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={((sensorData.phLevel - 5) / 3.5) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Soil pH level
            </p>
          </CardContent>
        </Card>

        {/* Pump Control */}
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-primary" />
                Pump Control
              </div>
              <Badge 
                variant={sensorData.pumpStatus ? "default" : "secondary"}
                className={sensorData.pumpStatus ? "bg-irrigation-success text-white" : ""}
              >
                {sensorData.pumpStatus ? "ON" : "OFF"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Zone Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Zone 1</span>
                <Button 
                  onClick={toggleZone1}
                  size="sm"
                  className={`${sensorData.zone1Status ? 'bg-irrigation-success hover:bg-irrigation-success/90' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
                >
                  {sensorData.zone1Status ? "ON" : "OFF"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Zone 2</span>
                <Button 
                  onClick={toggleZone2}
                  size="sm"
                  className={`${sensorData.zone2Status ? 'bg-irrigation-success hover:bg-irrigation-success/90' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
                >
                  {sensorData.zone2Status ? "ON" : "OFF"}
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Main pump: {sensorData.pumpStatus ? "ON" : "OFF"} 
              {sensorData.pumpStatus && " (supplying active zones)"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Last Update */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Last updated: {sensorData.lastUpdate}
        </p>
      </div>
    </div>
  );
};