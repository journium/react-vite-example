import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { CelebrationDialog } from "@/components/CelebrationDialog";
import { toast } from "sonner";
import { track, EVENTS } from "@/lib/events";
import { format } from "date-fns";
import { 
  CheckCircle2,
  Footprints,
  Droplets,
  Brain,
  Moon,
  Target,
  Sparkles
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

export default function Log() {
  const { habits, logHabit, getLogsForDate, getTodayProgress } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);
  const [habitValues, setHabitValues] = useState<Record<string, number>>({});

  const activeHabits = habits.filter(h => h.active);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayLogs = getLogsForDate(today);
  const todayProgress = getTodayProgress();

  // Track page view
  useEffect(() => {
    track(EVENTS.LOG_TODAY_VIEWED, {
      activeHabitsCount: activeHabits.length,
      completedCount: todayProgress.completed,
      completionRate: todayProgress.total > 0 
        ? Math.round((todayProgress.completed / todayProgress.total) * 100) 
        : 0
    });
  }, []);

  const isHabitCompleted = (habitId: string) => {
    return todayLogs.some(l => l.habitId === habitId && l.completed);
  };

  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    const isCurrentlyCompleted = isHabitCompleted(habitId);
    const value = habitValues[habitId] || habit?.target;
    
    logHabit(habitId, !isCurrentlyCompleted, value);
    
    track(EVENTS.HABIT_LOG_TOGGLED, { 
      habitId, 
      type: habit?.type,
      completed: !isCurrentlyCompleted,
      value 
    });
    
    if (!isCurrentlyCompleted) {
      toast.success(`${habit?.title} logged!`, {
        icon: <CheckCircle2 className="h-4 w-4 text-success" />,
      });
    }
  };

  const handleCompleteDay = () => {
    track(EVENTS.DAY_COMPLETED_CLICKED, {
      completedCount: todayProgress.completed,
      totalCount: todayProgress.total,
      allCompleted
    });
    
    if (allCompleted) {
      track(EVENTS.DAY_COMPLETED_SUCCEEDED);
    }
    
    setShowCelebration(true);
  };

  const allCompleted = todayProgress.completed === todayProgress.total && todayProgress.total > 0;
  const anyCompleted = todayProgress.completed > 0;

  if (activeHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">No habits to log yet</p>
        <Button onClick={() => window.location.href = "/habits"}>
          Add Your First Habit
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Today's Log</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Progress Summary */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-orange-400/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {allCompleted ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                <Sparkles className="h-6 w-6 text-success" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {todayProgress.completed}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">
                {allCompleted 
                  ? "All done for today!" 
                  : `${todayProgress.completed} of ${todayProgress.total} completed`
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {allCompleted 
                  ? "You're crushing it!" 
                  : "Keep going, you've got this!"
                }
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Habits List */}
      <div className="space-y-3">
        {activeHabits.map((habit) => {
          const Icon = habitIcons[habit.type] || Target;
          const isCompleted = isHabitCompleted(habit.id);
          const hasTarget = habit.target && habit.unit;
          
          return (
            <Card 
              key={habit.id}
              className={cn(
                "p-4 transition-all",
                isCompleted && "bg-success/5 border-success/20"
              )}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => handleToggleHabit(habit.id)}
                  className="mt-1 h-6 w-6 rounded-md"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      isCompleted ? "bg-success/20" : "bg-secondary"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        isCompleted ? "text-success" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className={cn(
                        "font-medium",
                        isCompleted && "line-through text-muted-foreground"
                      )}>
                        {habit.title}
                      </p>
                      {hasTarget && (
                        <p className="text-xs text-muted-foreground">
                          Target: {habit.target} {habit.unit}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {hasTarget && !isCompleted && (
                    <div className="flex items-center gap-2 ml-13">
                      <Input
                        type="number"
                        placeholder={`Enter ${habit.unit}`}
                        value={habitValues[habit.id] || ""}
                        onChange={(e) => {
                          const newValue = Number(e.target.value);
                          setHabitValues(prev => ({
                            ...prev,
                            [habit.id]: newValue
                          }));
                          
                          track(EVENTS.HABIT_LOG_VALUE_CHANGED, {
                            habitId: habit.id,
                            type: habit.type,
                            value: newValue,
                            unit: habit.unit
                          });
                        }}
                        className="w-32 h-9"
                      />
                      <span className="text-sm text-muted-foreground">
                        {habit.unit}
                      </span>
                    </div>
                  )}
                </div>

                {isCompleted && (
                  <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Complete Day Button */}
      {anyCompleted && (
        <Button 
          variant={allCompleted ? "success" : "default"}
          size="lg"
          className="w-full"
          onClick={handleCompleteDay}
        >
          {allCompleted ? (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Celebrate Your Day!
            </>
          ) : (
            "Complete Day"
          )}
        </Button>
      )}

      <CelebrationDialog
        open={showCelebration}
        onOpenChange={setShowCelebration}
        completedCount={todayProgress.completed}
        totalCount={todayProgress.total}
      />
    </div>
  );
}
