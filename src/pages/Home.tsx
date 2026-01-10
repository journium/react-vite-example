import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { PaywallDialog } from "@/components/PaywallDialog";
import { DashboardSkeleton } from "@/components/SkeletonCard";
import { format } from "date-fns";
import { 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Footprints,
  Droplets,
  Brain,
  Moon,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitType } from "@/lib/types";

const habitIcons: Record<HabitType, typeof Footprints> = {
  walk: Footprints,
  water: Droplets,
  meditate: Brain,
  sleep: Moon,
  custom: Target,
};

export default function Home() {
  const { 
    user, 
    habits, 
    isLoading, 
    getAllStreaks, 
    getTodayProgress, 
    getLogsForDate 
  } = useApp();
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const activeHabits = habits.filter(h => h.active);
  const streaks = getAllStreaks();
  const todayProgress = getTodayProgress();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayLogs = getLogsForDate(today);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading || isPageLoading) {
    return <DashboardSkeleton />;
  }

  if (activeHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-orange-400/10">
          <Target className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No habits yet</h1>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Start your wellness journey by setting up your first habits
        </p>
        <Button size="lg" onClick={() => navigate("/onboarding")}>
          Start Onboarding
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">Let's make today count</p>
      </div>

      {/* Today's Progress Card */}
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today's progress</p>
              <p className="text-3xl font-bold">
                {todayProgress.completed}/{todayProgress.total}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Completion</p>
              <p className="text-2xl font-semibold text-primary">
                {todayProgress.total > 0 
                  ? Math.round((todayProgress.completed / todayProgress.total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
          <Progress 
            value={todayProgress.total > 0 
              ? (todayProgress.completed / todayProgress.total) * 100 
              : 0
            } 
            className="h-3" 
          />
          <Button 
            className="w-full mt-4" 
            onClick={() => navigate("/log")}
          >
            Log Today's Habits
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Streaks Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Your Streaks</h2>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {activeHabits.map((habit) => {
            const streak = streaks.find(s => s.habitId === habit.id);
            const Icon = habitIcons[habit.type] || Target;
            const isLogged = todayLogs.some(l => l.habitId === habit.id && l.completed);
            
            return (
              <Card 
                key={habit.id} 
                variant={streak?.currentStreak && streak.currentStreak > 0 ? "premium" : "default"}
                className="flex-shrink-0 w-32 p-4 text-center"
              >
                <div className={cn(
                  "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg",
                  isLogged ? "bg-success/20" : "bg-secondary"
                )}>
                  {isLogged ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <p className="text-2xl font-bold text-primary">
                  {streak?.currentStreak || 0}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {habit.title}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Today's Habits List */}
      <div className="space-y-3">
        <h2 className="font-semibold">Today's Habits</h2>
        
        <div className="space-y-2">
          {activeHabits.map((habit) => {
            const Icon = habitIcons[habit.type] || Target;
            const isLogged = todayLogs.some(l => l.habitId === habit.id && l.completed);
            
            return (
              <Card 
                key={habit.id}
                variant="interactive"
                className="p-4"
                onClick={() => navigate("/log")}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isLogged ? "bg-success/20" : "bg-secondary"
                  )}>
                    {isLogged ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      isLogged && "line-through text-muted-foreground"
                    )}>
                      {habit.title}
                    </p>
                    {habit.target && habit.unit && (
                      <p className="text-xs text-muted-foreground">
                        Target: {habit.target} {habit.unit}
                      </p>
                    )}
                  </div>
                  {isLogged && (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Done
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upgrade Card (Free users only) */}
      {user?.plan === "free" && (
        <Card 
          variant="premium" 
          className="p-5 cursor-pointer"
          onClick={() => setShowPaywall(true)}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-400">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Unlock Pro Features</p>
              <p className="text-sm text-muted-foreground">
                Unlimited habits, deep insights & more
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
        </Card>
      )}

      <PaywallDialog 
        open={showPaywall} 
        onOpenChange={setShowPaywall}
        trigger="upgrade_card"
      />
    </div>
  );
}
