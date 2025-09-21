import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon,
  Droplets,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";

interface ReportData {
  date: string;
  totalWaterUsed: number;
  irrigationTime: number;
  pumpCycles: number;
  avgSoilMoisture: number;
  alerts: number;
  efficiency: number;
}

// Mock report data
const generateReportData = (days: number): ReportData[] => {
  const data: ReportData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      totalWaterUsed: Math.random() * 50 + 20, // 20-70 liters
      irrigationTime: Math.random() * 120 + 30, // 30-150 minutes
      pumpCycles: Math.floor(Math.random() * 8) + 2, // 2-10 cycles
      avgSoilMoisture: Math.random() * 30 + 50, // 50-80%
      alerts: Math.floor(Math.random() * 3), // 0-2 alerts
      efficiency: Math.random() * 20 + 75, // 75-95%
    });
  }
  
  return data;
};

const dailyReports = generateReportData(7);
const weeklyReports = generateReportData(30).filter((_, i) => i % 7 === 0);

export const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState("daily");
  const { toast } = useToast();

  const getCurrentData = () => {
    return reportType === "daily" ? dailyReports : weeklyReports;
  };

  const getTotalStats = () => {
    const data = getCurrentData();
    return {
      totalWater: data.reduce((sum, item) => sum + item.totalWaterUsed, 0),
      totalTime: data.reduce((sum, item) => sum + item.irrigationTime, 0),
      totalCycles: data.reduce((sum, item) => sum + item.pumpCycles, 0),
      avgEfficiency: data.reduce((sum, item) => sum + item.efficiency, 0) / data.length,
      totalAlerts: data.reduce((sum, item) => sum + item.alerts, 0),
    };
  };

  const stats = getTotalStats();

  const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
    const data = getCurrentData();
    const stats = getTotalStats();
    const currentDate = new Date().toLocaleDateString();
    
    try {
      switch (format) {
        case 'csv':
          exportToCSV(data, stats, currentDate);
          break;
        case 'excel':
          exportToExcel(data, stats, currentDate);
          break;
        case 'pdf':
          exportToPDF(data, stats, currentDate);
          break;
        default:
          throw new Error('Unsupported format');
      }
      
      toast({
        title: "Export Successful",
        description: `${reportType} report exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: `Failed to export ${format.toUpperCase()} report. Please try again.`,
      });
    }
  };

  const exportToCSV = (data: ReportData[], stats: any, date: string) => {
    const headers = ['Date', 'Water Used (L)', 'Runtime (min)', 'Pump Cycles', 'Avg Soil Moisture (%)', 'Alerts', 'Efficiency (%)'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.date,
        row.totalWaterUsed.toFixed(2),
        row.irrigationTime.toFixed(1),
        row.pumpCycles,
        row.avgSoilMoisture.toFixed(1),
        row.alerts,
        row.efficiency.toFixed(1)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `AgroSmart_${reportType}_Report_${date.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: ReportData[], stats: any, date: string) => {
    // Create Excel-like CSV with proper formatting
    const headers = ['Date', 'Water Used (L)', 'Runtime (min)', 'Pump Cycles', 'Avg Soil Moisture (%)', 'Alerts', 'Efficiency (%)'];
    const csvContent = [
      'AgroSmart Irrigation Report',
      `Generated: ${date}`,
      `Report Type: ${reportType === 'daily' ? 'Daily' : 'Weekly'} Report`,
      `Total Water: ${stats.totalWater.toFixed(1)}L`,
      `Total Runtime: ${Math.floor(stats.totalTime / 60)}h ${Math.floor(stats.totalTime % 60)}m`,
      `Total Cycles: ${stats.totalCycles}`,
      `Average Efficiency: ${stats.avgEfficiency.toFixed(1)}%`,
      `Total Alerts: ${stats.totalAlerts}`,
      '',
      headers.join(','),
      ...data.map(row => [
        row.date,
        row.totalWaterUsed.toFixed(2),
        row.irrigationTime.toFixed(1),
        row.pumpCycles,
        row.avgSoilMoisture.toFixed(1),
        row.alerts,
        row.efficiency.toFixed(1)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `AgroSmart_${reportType}_Report_${date.replace(/\//g, '-')}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: ReportData[], stats: any, date: string) => {
    // Create a simple PDF-like HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AgroSmart Irrigation Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #2d5a27; }
          .subtitle { font-size: 16px; color: #666; margin-top: 10px; }
          .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .summary h3 { margin-top: 0; color: #2d5a27; }
          .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .summary-item { text-align: center; }
          .summary-value { font-size: 20px; font-weight: bold; color: #2d5a27; }
          .summary-label { font-size: 12px; color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #2d5a27; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">AgroSmart Irrigation Report</div>
          <div class="subtitle">Generated on ${date}</div>
          <div class="subtitle">${reportType === 'daily' ? 'Daily' : 'Weekly'} Report</div>
        </div>
        
        <div class="summary">
          <h3>Summary Statistics</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">${stats.totalWater.toFixed(1)}L</div>
              <div class="summary-label">Total Water Used</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${Math.floor(stats.totalTime / 60)}h ${Math.floor(stats.totalTime % 60)}m</div>
              <div class="summary-label">Total Runtime</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${stats.totalCycles}</div>
              <div class="summary-label">Pump Cycles</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${stats.avgEfficiency.toFixed(1)}%</div>
              <div class="summary-label">Avg Efficiency</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${stats.totalAlerts}</div>
              <div class="summary-label">Total Alerts</div>
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Water Used (L)</th>
              <th>Runtime (min)</th>
              <th>Pump Cycles</th>
              <th>Avg Soil Moisture (%)</th>
              <th>Alerts</th>
              <th>Efficiency (%)</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                <td>${row.date}</td>
                <td>${row.totalWaterUsed.toFixed(2)}</td>
                <td>${row.irrigationTime.toFixed(1)}</td>
                <td>${row.pumpCycles}</td>
                <td>${row.avgSoilMoisture.toFixed(1)}</td>
                <td>${row.alerts}</td>
                <td>${row.efficiency.toFixed(1)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Generated by AgroSmart Smart Irrigation Management System</p>
          <p>For more information, visit the AgroSmart dashboard</p>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `AgroSmart_${reportType}_Report_${date.replace(/\//g, '-')}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">AgroSmart usage analytics and insights</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportReport('pdf')}
              className="gap-1"
            >
              <Download className="w-3 h-3" />
              PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportReport('csv')}
              className="gap-1"
            >
              <FileText className="w-3 h-3" />
              CSV
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportReport('excel')}
              className="gap-1"
            >
              <FileText className="w-3 h-3" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Daily Reports</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
        </TabsList>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Droplets className="w-4 h-4 text-irrigation-blue" />
                Total Water
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-irrigation-blue">
                {stats.totalWater.toFixed(1)}L
              </div>
              <p className="text-xs text-muted-foreground">
                Last {reportType === 'daily' ? '7 days' : '4 weeks'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-irrigation-earth" />
                Runtime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-irrigation-earth">
                {Math.floor(stats.totalTime / 60)}h {Math.floor(stats.totalTime % 60)}m
              </div>
              <p className="text-xs text-muted-foreground">
                Total irrigation time
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-irrigation-success" />
                Pump Cycles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-irrigation-success">
                {stats.totalCycles}
              </div>
              <p className="text-xs text-muted-foreground">
                Start/stop cycles
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.avgEfficiency.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Average efficiency
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-irrigation-warning" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-irrigation-warning">
                {stats.totalAlerts}
              </div>
              <p className="text-xs text-muted-foreground">
                System alerts
              </p>
            </CardContent>
          </Card>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Daily Usage Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {new Date(report.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {report.irrigationTime} min runtime • {report.pumpCycles} cycles
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold text-irrigation-blue">
                        {report.totalWaterUsed.toFixed(1)}L
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={report.efficiency > 85 ? "default" : report.efficiency > 70 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {report.efficiency.toFixed(1)}% efficient
                        </Badge>
                        {report.alerts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {report.alerts} alerts
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Weekly Usage Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="space-y-1">
                      <div className="font-medium">
                        Week of {new Date(report.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg: {report.avgSoilMoisture.toFixed(1)}% soil moisture
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold text-irrigation-blue">
                        {(report.totalWaterUsed * 7).toFixed(1)}L
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={report.efficiency > 85 ? "default" : report.efficiency > 70 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {report.efficiency.toFixed(1)}% efficient
                        </Badge>
                        {report.irrigationTime > 600 && (
                          <TrendingUp className="w-4 h-4 text-irrigation-success" />
                        )}
                        {report.irrigationTime < 300 && (
                          <TrendingDown className="w-4 h-4 text-irrigation-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
