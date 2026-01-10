import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { PaywallDialog } from "@/components/PaywallDialog";
import { InsightsSkeleton } from "@/components/SkeletonCard";
import { track, EVENTS } from "@/lib/events";
import { format, startOfWeek, endOfWeek, subWeeks, addWeeks, parseISO } from "date-fns";
import { 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Trophy,
  AlertCircle,
  Star,
  Lock,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Insights() {
  const { getWeeklyInsights, habits, user } = useApp();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const insights = getWeeklyInsights(weekStart);
  const isPro = user?.plan === "pro";

  useEffect(() => {
    // Track page view
    track(EVENTS.INSIGHTS_VIEWED, {
      weekStart: format(weekStart, "yyyy-MM-dd"),
      isCurrentWeek,
      completionRate: Math.round(insights.completionRate),
      plan: user?.plan
    });
    
    // Track pro insights locked view for free users
    if (!isPro) {
      track(EVENTS.PRO_INSIGHTS_LOCKED_VIEWED);
    }
    
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [weekStart]);

  const goToPreviousWeek = () => {
    const newWeekStart = subWeeks(weekStart, 1);
    setWeekStart(newWeekStart);
    track(EVENTS.INSIGHTS_WEEK_CHANGED, { 
      direction: "previous",
      weekStart: format(newWeekStart, "yyyy-MM-dd")
    });
  };
  
  const goToNextWeek = () => {
    const newWeekStart = addWeeks(weekStart, 1);
    setWeekStart(newWeekStart);
    track(EVENTS.INSIGHTS_WEEK_CHANGED, { 
      direction: "next",
      weekStart: format(newWeekStart, "yyyy-MM-dd")
    });
  };
  
  const isCurrentWeek = format(weekStart, "yyyy-MM-dd") === format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (isLoading) {
    return <InsightsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Week Selector */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Insights</h1>
        
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </p>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToNextWeek}
              disabled={isCurrentWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(insights.completionRate)}%</p>
              <p className="text-sm text-muted-foreground">Completion rate</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Trophy className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold truncate">
                {insights.bestDay?.day || "—"}
              </p>
              <p className="text-sm text-muted-foreground">Best day</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold truncate">
                {insights.hardestDay?.day || "—"}
              </p>
              <p className="text-sm text-muted-foreground">Hardest day</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Most Consistent Habit */}
      {insights.mostConsistentHabit && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{insights.mostConsistentHabit.title}</p>
              <p className="text-sm text-muted-foreground">Most consistent habit</p>
            </div>
            <Badge variant="secondary">🔥</Badge>
          </div>
        </Card>
      )}

      {/* Weekly Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Daily Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-2">
            {insights.dailyStats.map((day, index) => {
              const date = parseISO(day.date);
              const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              
              return (
                <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                  <span className={cn(
                    "text-xs",
                    isToday ? "font-semibold text-primary" : "text-muted-foreground"
                  )}>
                    {dayNames[index]}
                  </span>
                  
                  <div 
                    className={cn(
                      "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                      day.completionRate === 100 && "bg-success text-success-foreground",
                      day.completionRate > 0 && day.completionRate < 100 && "bg-primary/20 text-primary",
                      day.completionRate === 0 && "bg-secondary text-muted-foreground",
                      isToday && "ring-2 ring-primary ring-offset-2"
                    )}
                  >
                    {day.completedHabits}/{day.totalHabits}
                  </div>
                  
                  <span className="text-xs text-muted-foreground">
                    {format(date, "d")}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pro Insights Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Pro Insights</h2>
          {!isPro && (
            <Badge variant="secondary" className="text-xs">
              <Lock className="mr-1 h-3 w-3" />
              Pro
            </Badge>
          )}
        </div>

        <div className={cn("space-y-3", !isPro && "relative")}>
          {/* Blurred content for free users */}
          <div className={cn(!isPro && "blur-sm pointer-events-none")}>
            <Card className="p-4">
              <CardTitle className="text-base mb-3">Habit Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your walk habit has improved 23% this week compared to last week.
              </p>
            </Card>

            <Card className="p-4">
              <CardTitle className="text-base mb-3">Personalized Tips</CardTitle>
              <p className="text-sm text-muted-foreground">
                You're most consistent on Tuesday mornings. Consider scheduling harder habits then.
              </p>
            </Card>

            <Card className="p-4">
              <CardTitle className="text-base mb-3">Monthly Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                You've maintained a 78% completion rate over the past 30 days.
              </p>
            </Card>
          </div>

          {/* Upgrade overlay for free users */}
          {!isPro && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px] rounded-lg">
              <div className="text-center p-6">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium mb-2">Unlock Deep Insights</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized tips and detailed analytics
                </p>
                <Button onClick={() => {
                  track(EVENTS.PAYWALL_TRIGGERED, { source: "insights_locked" });
                  setShowPaywall(true);
                }}>
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PaywallDialog 
        open={showPaywall} 
        onOpenChange={setShowPaywall}
        trigger="insights"
      />
    </div>
  );
}
