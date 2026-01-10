import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { track, EVENTS } from "@/lib/events";
import { 
  Moon, 
  Dumbbell, 
  Heart, 
  Droplets, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Bell,
  BellOff,
  Footprints,
  Brain,
  Clock,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitType } from "@/lib/types";

const goals = [
  { id: "sleep", label: "Sleep better", icon: Moon, color: "from-indigo-500 to-purple-500" },
  { id: "fitness", label: "Get fitter", icon: Dumbbell, color: "from-red-500 to-orange-500" },
  { id: "stress", label: "Reduce stress", icon: Heart, color: "from-pink-500 to-rose-500" },
  { id: "hydration", label: "Drink more water", icon: Droplets, color: "from-blue-500 to-cyan-500" },
];

const habitTemplates = [
  { id: "walk", type: "walk" as HabitType, title: "Walk 20 minutes", icon: Footprints, target: 20, unit: "min" },
  { id: "water", type: "water" as HabitType, title: "Drink 2L water", icon: Droplets, target: 2000, unit: "ml" },
  { id: "meditate", type: "meditate" as HabitType, title: "Meditate 10 min", icon: Brain, target: 10, unit: "min" },
  { id: "sleep", type: "sleep" as HabitType, title: "Sleep by 11pm", icon: Moon, target: 23, unit: "hour" },
];

export default function Onboarding() {
  const { addHabit, updateUser, updateSettings } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [customHabit, setCustomHabit] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // Track initial view
  useEffect(() => {
    track(EVENTS.ONBOARDING_STEP_VIEWED, { step: 1, stepName: "goal" });
  }, []);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    track(EVENTS.ONBOARDING_GOAL_SELECTED, { goal: goalId });
  };

  const toggleHabit = (habitId: string) => {
    const isAdding = !selectedHabits.includes(habitId);
    setSelectedHabits(prev => 
      prev.includes(habitId)
        ? prev.filter(h => h !== habitId)
        : prev.length < 3 ? [...prev, habitId] : prev
    );
    
    track(EVENTS.ONBOARDING_HABIT_TOGGLED, { 
      habitId, 
      action: isAdding ? "add" : "remove",
      count: isAdding ? selectedHabits.length + 1 : selectedHabits.length - 1
    });
  };

  const handleAddCustomHabit = () => {
    if (customHabit.trim() && selectedHabits.length < 3) {
      setSelectedHabits(prev => [...prev, `custom:${customHabit}`]);
      setCustomHabit("");
    }
  };

  const handleNotificationChoice = (allowed: boolean) => {
    updateSettings({ 
      notificationPermission: allowed ? "allowed" : "denied",
      reminderTime 
    });
    
    if (allowed) {
      track(EVENTS.NOTIFICATION_PERMISSION_PROMPT_ACCEPTED);
      track(EVENTS.ONBOARDING_REMINDER_SET, { reminderTime });
      toast.success("Reminders enabled!");
    } else {
      track(EVENTS.NOTIFICATION_PERMISSION_PROMPT_DISMISSED);
      track(EVENTS.ONBOARDING_REMINDER_SKIPPED);
    }
    
    handleComplete();
  };

  const handleComplete = () => {
    // Create habits
    selectedHabits.forEach(habitId => {
      if (habitId.startsWith("custom:")) {
        const title = habitId.replace("custom:", "");
        addHabit({
          title,
          type: "custom",
          frequency: "daily",
          active: true,
        });
        track(EVENTS.HABIT_CREATED, { type: "custom", title, source: "onboarding" });
      } else {
        const template = habitTemplates.find(t => t.id === habitId);
        if (template) {
          addHabit({
            title: template.title,
            type: template.type,
            frequency: "daily",
            target: template.target,
            unit: template.unit,
            active: true,
          });
          track(EVENTS.HABIT_CREATED, { type: template.type, title: template.title, source: "onboarding" });
        }
      }
    });

    updateUser({ hasCompletedOnboarding: true });
    
    track(EVENTS.ONBOARDING_COMPLETED, { 
      goal: selectedGoal, 
      habitsCount: selectedHabits.length,
      hasCustomHabits: selectedHabits.some(h => h.startsWith("custom:"))
    });
    
    toast.success("You're all set! Let's start logging!");
    navigate("/log");
  };

  const nextStep = () => {
    if (step < totalSteps) {
      // Track completion of current step
      const stepNames = ["goal", "habits", "reminder", "notifications"];
      track(EVENTS.ONBOARDING_STEP_COMPLETED, { 
        step, 
        stepName: stepNames[step - 1] 
      });
      
      const nextStepNum = step + 1;
      setStep(nextStepNum);
      
      // Track view of next step
      track(EVENTS.ONBOARDING_STEP_VIEWED, { 
        step: nextStepNum, 
        stepName: stepNames[nextStepNum - 1] 
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-400">
              <span className="text-sm font-bold text-primary-foreground">L</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Choose Goal */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">What's your main goal?</h1>
              <p className="text-muted-foreground">We'll help you build habits around it</p>
            </div>

            <div className="grid gap-3">
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  variant={selectedGoal === goal.id ? "premium" : "interactive"}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={cn(
                    "cursor-pointer p-4",
                    selectedGoal === goal.id && "ring-2 ring-primary"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                      goal.color
                    )}>
                      <goal.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-medium text-lg">{goal.label}</span>
                    {selectedGoal === goal.id && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              className="w-full" 
              size="lg"
              disabled={!selectedGoal}
              onClick={nextStep}
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Pick Habits */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Pick your habits</h1>
              <p className="text-muted-foreground">Choose 1-3 habits to start with</p>
            </div>

            <div className="grid gap-3">
              {habitTemplates.map((habit) => (
                <Card
                  key={habit.id}
                  variant={selectedHabits.includes(habit.id) ? "success" : "interactive"}
                  onClick={() => toggleHabit(habit.id)}
                  className={cn(
                    "cursor-pointer p-4",
                    selectedHabits.includes(habit.id) && "ring-2 ring-success"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <habit.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="font-medium">{habit.title}</span>
                    {selectedHabits.includes(habit.id) && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-success" />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Create custom habit..."
                  value={customHabit}
                  onChange={(e) => setCustomHabit(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustomHabit()}
                />
                <Button 
                  size="icon" 
                  variant="secondary"
                  onClick={handleAddCustomHabit}
                  disabled={!customHabit.trim() || selectedHabits.length >= 3}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {selectedHabits.filter(h => h.startsWith("custom:")).map(h => (
                <div key={h} className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {h.replace("custom:", "")}
                </div>
              ))}
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                className="flex-1" 
                size="lg"
                disabled={selectedHabits.length === 0}
                onClick={nextStep}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Reminder Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Set your reminder</h1>
              <p className="text-muted-foreground">When should we remind you to log?</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <Label htmlFor="time" className="text-base font-medium">Reminder time</Label>
                    <p className="text-sm text-muted-foreground">We'll nudge you at this time daily</p>
                  </div>
                </div>
                <Input
                  id="time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                className="flex-1" 
                size="lg"
                onClick={nextStep}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" className="w-full" onClick={nextStep}>
              Skip for now
            </Button>
          </div>
        )}

        {/* Step 4: Notification Permission */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-orange-400/10">
                <Bell className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Stay on track</h1>
              <p className="text-muted-foreground">
                Enable notifications to get gentle reminders and celebrate your streaks
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handleNotificationChoice(true)}
              >
                <Bell className="mr-2 h-5 w-5" />
                Allow notifications
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => handleNotificationChoice(false)}
              >
                <BellOff className="mr-2 h-5 w-5" />
                Not now
              </Button>
            </div>

            <Button variant="outline" onClick={prevStep} className="w-full">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
