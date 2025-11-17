import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from "@/lib/supabase";

const Report = () => {
  // realtime state
  const [promptTypeData, setPromptTypeData] = useState(
    [
      { name: "Gignaati", value: 45, color: "hsl(221 83% 53%)" },
      { name: "Swaransoft", value: 35, color: "hsl(142 76% 36%)" },
      { name: "Custom", value: 20, color: "hsl(220 14% 46%)" },
    ]
  );

  const [promptStatusData, setPromptStatusData] = useState(
    [
      { name: "Successful", value: 78, color: "hsl(142 76% 36%)" },
      { name: "Failed", value: 12, color: "hsl(0 84% 60%)" },
      { name: "Pending", value: 10, color: "hsl(221 83% 53%)" },
    ]
  );

  const [totalPrompts, setTotalPrompts] = useState<number>(150);
  const [todayPrompts, setTodayPrompts] = useState<number>(12);
  const [weekPrompts, setWeekPrompts] = useState<number>(67);
  const [recentEvents, setRecentEvents] = useState<Array<Record<string, any>>>([]);

  // Fetch stats from Supabase and compute derived values
  const fetchStats = async () => {
    try {
      const { data: submissions } = await supabase
        .from('submissions')
        .select('id,status,prompt,submitted_at');

      if (!submissions) return;

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

      let total = 0;
      let today = 0;
      let week = 0;
      const statusCounts: Record<string, number> = {};
      const typeCounts: Record<string, number> = { Gignaati: 0, Swaransoft: 0, Custom: 0 };

      submissions.forEach((s: any) => {
        total += 1;
        const submittedAt = s.submitted_at ? new Date(s.submitted_at) : null;
        if (submittedAt) {
          if (submittedAt >= startOfToday) today += 1;
          if (submittedAt >= startOfWeek) week += 1;
        }

        const status = s.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        const promptText = (s.prompt || '').toLowerCase();
        if (promptText.includes('gignaati')) typeCounts.Gignaati += 1;
        else if (promptText.includes('swaransoft')) typeCounts.Swaransoft += 1;
        else typeCounts.Custom += 1;
      });

      setTotalPrompts(total);
      setTodayPrompts(today);
      setWeekPrompts(week);

      setPromptStatusData([
        { name: 'Successful', value: statusCounts.success || 0, color: 'hsl(142 76% 36%)' },
        { name: 'Failed', value: statusCounts.failed || 0, color: 'hsl(0 84% 60%)' },
        { name: 'Pending', value: statusCounts.pending || 0, color: 'hsl(221 83% 53%)' },
      ]);

      setPromptTypeData([
        { name: 'Gignaati', value: typeCounts.Gignaati, color: 'hsl(221 83% 53%)' },
        { name: 'Swaransoft', value: typeCounts.Swaransoft, color: 'hsl(142 76% 36%)' },
        { name: 'Custom', value: typeCounts.Custom, color: 'hsl(220 14% 46%)' },
      ]);
    } catch (err) {
      console.error('Failed to fetch report stats', err);
    }
  };

  useEffect(() => {
    fetchStats();

    // subscribe to submissions table changes
    const channel = supabase
      .channel('public:submissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, (payload) => {
        // refresh stats on any change
        fetchStats();
        // add to recent events
        setRecentEvents((prev) => {
          const ev = { type: payload.eventType, record: payload.new || payload.old, ts: new Date().toISOString() };
          return [ev, ...prev].slice(0, 20);
        });
      })
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch (e) { /* ignore */ }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text ">Analytics Report</span>
          </h1>
          <p className="text-muted-foreground">
            Track your prompt usage and performance metrics
          </p>
        </div>

        {/* Recent Events (real-time) */}
        <div className="grid grid-cols-1 gap-6 animate-slide-up">
          <Card className="border-border/50 shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Live submissions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent events</p>
              ) : (
                <ul className="space-y-2">
                  {recentEvents.map((ev, idx) => (
                    <li key={idx} className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">{ev.type}</div>
                        <div className="text-xs text-muted-foreground">{ev.record?.prompt ? `${ev.record.prompt.substring(0, 80)}${ev.record.prompt.length>80 ? '...' : ''}` : JSON.stringify(ev.record)}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(ev.ts).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
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
