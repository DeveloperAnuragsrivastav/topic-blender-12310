import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const Report = () => {
  // Mock data for demonstration
  const promptTypeData = [
    { name: "Gignaati", value: 45, color: "hsl(221 83% 53%)" },
    { name: "Swaransoft", value: 35, color: "hsl(142 76% 36%)" },
    { name: "Custom", value: 20, color: "hsl(220 14% 46%)" },
  ];

  const promptStatusData = [
    { name: "Successful", value: 78, color: "hsl(142 76% 36%)" },
    { name: "Failed", value: 12, color: "hsl(0 84% 60%)" },
    { name: "Pending", value: 10, color: "hsl(221 83% 53%)" },
  ];

  const totalPrompts = 150;
  const todayPrompts = 12;
  const weekPrompts = 67;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Analytics Report</span>
          </h1>
          <p className="text-muted-foreground">
            Track your prompt usage and performance metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription>Total Prompts</CardDescription>
              <CardTitle className="text-3xl font-bold text-primary">{totalPrompts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All time usage</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription>Today's Prompts</CardDescription>
              <CardTitle className="text-3xl font-bold text-accent">{todayPrompts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl font-bold text-primary-glow">{weekPrompts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle>Prompt Types</CardTitle>
              <CardDescription>Distribution of prompt templates used</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={promptTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {promptTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle>Prompt Status</CardTitle>
              <CardDescription>Success rate and delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={promptStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {promptStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Note */}
        <Card className="border-border/50 bg-muted/30 animate-scale-in" style={{ animationDelay: "200ms" }}>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              📊 Connect backend to see real-time analytics and historical data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Report;
