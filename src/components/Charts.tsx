import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { TrendingUp, Droplets, Thermometer, Wind } from "lucide-react";

// Mock data for different time periods
const generateMockData = (hours: number, period: string) => {
  const data = [];
  const now = new Date();
  
  if (period === "7d") {
    // Generate data for 7 days (one data point per day)
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        fullTime: time.toLocaleString(),
        soilMoisture: Math.max(30, Math.min(100, 65 + Math.sin(i * 0.3) * 20 + Math.random() * 10)),
        sunlight: Math.max(15, Math.min(35, 24 + Math.sin(i * 0.2) * 5 + Math.random() * 2)),
        rainfall: Math.max(40, Math.min(90, 58 + Math.cos(i * 0.4) * 15 + Math.random() * 5)),
        phLevel: Math.max(5.0, Math.min(8.5, 6.8 + Math.sin(i * 0.1) * 1.5 + Math.random() * 0.5)),
      });
    }
  } else if (period === "30d") {
    // Generate data for 30 days (one data point per day)
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        fullTime: time.toLocaleString(),
        soilMoisture: Math.max(30, Math.min(100, 65 + Math.sin(i * 0.1) * 20 + Math.random() * 10)),
        sunlight: Math.max(15, Math.min(35, 24 + Math.sin(i * 0.05) * 5 + Math.random() * 2)),
        rainfall: Math.max(40, Math.min(90, 58 + Math.cos(i * 0.08) * 15 + Math.random() * 5)),
        phLevel: Math.max(5.0, Math.min(8.5, 6.8 + Math.sin(i * 0.03) * 1.5 + Math.random() * 0.5)),
      });
    }
  } else {
    // Generate hourly data for 24h
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTime: time.toLocaleString(),
        soilMoisture: Math.max(30, Math.min(100, 65 + Math.sin(i * 0.1) * 20 + Math.random() * 10)),
        sunlight: Math.max(15, Math.min(35, 24 + Math.sin(i * 0.05) * 5 + Math.random() * 2)),
        rainfall: Math.max(40, Math.min(90, 58 + Math.cos(i * 0.08) * 15 + Math.random() * 5)),
        phLevel: Math.max(5.0, Math.min(8.5, 6.8 + Math.sin(i * 0.03) * 1.5 + Math.random() * 0.5)),
      });
    }
  }
  
  return data;
};

const data24h = generateMockData(24, "24h");
const data7d = generateMockData(7, "7d");
const data30d = generateMockData(30, "30d");

export const Charts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("24h");
  
  const getData = () => {
    switch (selectedPeriod) {
      case "7d": return data7d;
      case "30d": return data30d;
      default: return data24h;
    }
  };

  const data = getData();

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Sensor data trends and insights</p>
        </div>
      </div>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="24h">24 Hours</TabsTrigger>
          <TabsTrigger value="7d">7 Days</TabsTrigger>
          <TabsTrigger value="30d">30 Days</TabsTrigger>
        </TabsList>

        <div className="grid gap-6">
          {/* Soil Moisture Trend */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-irrigation-green" />
                Soil Moisture Trends
                <TrendingUp className="w-4 h-4 ml-auto text-irrigation-success" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="time" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullTime || label;
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Soil Moisture']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="soilMoisture" 
                    stroke="hsl(var(--irrigation-green))"
                    fill="hsl(var(--irrigation-green) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sunlight & Rainfall */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-irrigation-earth" />
                Sunlight & Rainfall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="time" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullTime || label;
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}${name === 'sunlight' ? '°C' : '%'}`, 
                      name === 'sunlight' ? 'Sunlight' : 'Rainfall'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sunlight" 
                    stroke="hsl(var(--irrigation-earth))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rainfall" 
                    stroke="hsl(var(--irrigation-blue))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* pH Level */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-irrigation-blue" />
                pH Level Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="time" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullTime || label;
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}`, 'pH Level']}
                  />
                  <Bar 
                    dataKey="phLevel" 
                    fill="hsl(var(--irrigation-blue) / 0.8)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};