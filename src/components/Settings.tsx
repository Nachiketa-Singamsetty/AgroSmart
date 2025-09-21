import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon,
  Bell,
  Droplets,
  Thermometer,
  Wifi,
  Save,
  RefreshCw,
  Smartphone,
  Mail,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsData {
  // System Settings
  deviceName: string;
  location: string;
  timezone: string;
  
  // Irrigation Settings
  autoMode: boolean;
  moistureThreshold: number[];
  irrigationDuration: number[];
  maxDailyWater: number[];
  
  // Notifications
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowWaterAlert: boolean;
  pumpStatusAlert: boolean;
  soilDryAlert: boolean;
  
  // Sensor Calibration
  soilMoistureCal: number[];
  temperatureCal: number[];
  
  // Network
  wifiSSID: string;
  deviceIP: string;
  mqttBroker: string;
}

export const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    // System Settings
    deviceName: "AgroSmart Irrigation System",
    location: "Main Garden",
    timezone: "UTC-5",
    
    // Irrigation Settings
    autoMode: true,
    moistureThreshold: [40],
    irrigationDuration: [15],
    maxDailyWater: [100],
    
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    lowWaterAlert: true,
    pumpStatusAlert: true,
    soilDryAlert: true,
    
    // Sensor Calibration
    soilMoistureCal: [0],
    temperatureCal: [0],
    
    // Network
    wifiSSID: "Home-WiFi-2.4G",
    deviceIP: "192.168.1.100",
    mqttBroker: "localhost:1883",
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Mock API call - replace with real backend integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Settings Saved",
        description: "Your AgroSmart system settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings(prev => ({
      ...prev,
      moistureThreshold: [40],
      irrigationDuration: [15],
      maxDailyWater: [100],
      soilMoistureCal: [0],
      temperatureCal: [0],
    }));
    
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to default values.",
    });
  };

  const updateSetting = (key: keyof SettingsData, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your AgroSmart system</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deviceName">Device Name</Label>
                  <Input
                    id="deviceName"
                    value={settings.deviceName}
                    onChange={(e) => updateSetting("deviceName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={(e) => updateSetting("location", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => updateSetting("timezone", e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">UTC</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Irrigation Settings */}
        <TabsContent value="irrigation" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-irrigation-green" />
                Irrigation Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Automatic Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable automatic irrigation based on soil moisture
                  </p>
                </div>
                <Switch
                  checked={settings.autoMode}
                  onCheckedChange={(checked) => updateSetting("autoMode", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label>Soil Moisture Threshold: {settings.moistureThreshold[0]}%</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Start irrigation when soil moisture drops below this level
                  </p>
                  <Slider
                    value={settings.moistureThreshold}
                    onValueChange={(value) => updateSetting("moistureThreshold", value)}
                    max={80}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label>Irrigation Duration: {settings.irrigationDuration[0]} minutes</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How long to run irrigation when triggered
                  </p>
                  <Slider
                    value={settings.irrigationDuration}
                    onValueChange={(value) => updateSetting("irrigationDuration", value)}
                    max={60}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label>Max Daily Water: {settings.maxDailyWater[0]} liters</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Maximum water usage per day (safety limit)
                  </p>
                  <Slider
                    value={settings.maxDailyWater}
                    onValueChange={(value) => updateSetting("maxDailyWater", value)}
                    max={200}
                    min={20}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-irrigation-warning" />
                Alert Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <Label>Push Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <Label>Email Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <Label>SMS Notifications</Label>
                    <Badge variant="secondary" className="text-xs">Premium</Badge>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base font-medium">Alert Types</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Low Water Level</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when tank water level is low
                    </p>
                  </div>
                  <Switch
                    checked={settings.lowWaterAlert}
                    onCheckedChange={(checked) => updateSetting("lowWaterAlert", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Pump Status Changes</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when pump starts or stops
                    </p>
                  </div>
                  <Switch
                    checked={settings.pumpStatusAlert}
                    onCheckedChange={(checked) => updateSetting("pumpStatusAlert", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Soil Too Dry</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when soil moisture is critically low
                    </p>
                  </div>
                  <Switch
                    checked={settings.soilDryAlert}
                    onCheckedChange={(checked) => updateSetting("soilDryAlert", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-irrigation-earth" />
                Sensor Calibration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Soil Moisture Calibration: {settings.soilMoistureCal[0]}%</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Adjust sensor reading offset (-20% to +20%)
                </p>
                <Slider
                  value={settings.soilMoistureCal}
                  onValueChange={(value) => updateSetting("soilMoistureCal", value)}
                  max={20}
                  min={-20}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label>Temperature Calibration: {settings.temperatureCal[0]}°C</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Adjust temperature reading offset (-5°C to +5°C)
                </p>
                <Slider
                  value={settings.temperatureCal}
                  onValueChange={(value) => updateSetting("temperatureCal", value)}
                  max={5}
                  min={-5}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-irrigation-blue" />
                Network Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wifiSSID">WiFi Network</Label>
                  <Input
                    id="wifiSSID"
                    value={settings.wifiSSID}
                    onChange={(e) => updateSetting("wifiSSID", e.target.value)}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deviceIP">Device IP Address</Label>
                  <Input
                    id="deviceIP"
                    value={settings.deviceIP}
                    onChange={(e) => updateSetting("deviceIP", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mqttBroker">MQTT Broker</Label>
                <Input
                  id="mqttBroker"
                  value={settings.mqttBroker}
                  onChange={(e) => updateSetting("mqttBroker", e.target.value)}
                  placeholder="broker.hivemq.com:1883"
                />
                <p className="text-sm text-muted-foreground">
                  MQTT broker for real-time data communication
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
