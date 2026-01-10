import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/store";
import { PaywallDialog } from "@/components/PaywallDialog";
import { toast } from "sonner";
import { track, Events } from "@/lib/events";
import { 
  Plus, 
  MoreVertical,
  Footprints,
  Droplets,
  Brain,
  Moon,
  Target,
  Archive,
  Pencil
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { HabitType } from "@/lib/types";

const habitIcons: Record<HabitType, typeof Footprints> = {
  walk: Footprints,
  water: Droplets,
  meditate: Brain,
  sleep: Moon,
  custom: Target,
};

const habitTypes: { value: HabitType; label: string }[] = [
  { value: "walk", label: "Walking" },
  { value: "water", label: "Hydration" },
  { value: "meditate", label: "Meditation" },
  { value: "sleep", label: "Sleep" },
  { value: "custom", label: "Custom" },
];

export default function Habits() {
  const { habits, addHabit, updateHabit, archiveHabit, canAddMoreHabits, user } = useApp();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<HabitType>("custom");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");

  const activeHabits = habits.filter(h => h.active);
  const archivedHabits = habits.filter(h => !h.active);

  const resetForm = () => {
    setTitle("");
    setType("custom");
    setTarget("");
    setUnit("");
    setEditingHabit(null);
  };

  const handleOpenAddDialog = () => {
    if (!canAddMoreHabits()) {
      setShowPaywall(true);
      return;
    }
    resetForm();
    setShowAddDialog(true);
  };

  const handleEditHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setTitle(habit.title);
      setType(habit.type);
      setTarget(habit.target?.toString() || "");
      setUnit(habit.unit || "");
      setEditingHabit(habitId);
      setShowAddDialog(true);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a habit title");
      return;
    }

    if (editingHabit) {
      updateHabit(editingHabit, {
        title: title.trim(),
        type,
        target: target ? Number(target) : undefined,
        unit: unit || undefined,
      });
      toast.success("Habit updated!");
    } else {
      addHabit({
        title: title.trim(),
        type,
        frequency: "daily",
        target: target ? Number(target) : undefined,
        unit: unit || undefined,
        active: true,
      });
      // TODO: Analytics - habit created
      track(Events.HABIT_CREATED, { type, title: title.trim() });
      toast.success("Habit created!");
    }

    setShowAddDialog(false);
    resetForm();
  };

  const handleArchive = (habitId: string) => {
    archiveHabit(habitId);
    // TODO: Analytics - habit archived
    track(Events.HABIT_ARCHIVED, { habitId });
    toast.success("Habit archived");
  };

  const handleReactivate = (habitId: string) => {
    if (!canAddMoreHabits()) {
      setShowPaywall(true);
      return;
    }
    updateHabit(habitId, { active: true });
    toast.success("Habit reactivated!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Habits</h1>
          <p className="text-muted-foreground">
            {activeHabits.length} active habit{activeHabits.length !== 1 ? "s" : ""}
            {user?.plan === "free" && ` (${3 - activeHabits.length} slots left)`}
          </p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {/* Active Habits */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Active
        </h2>
        
        {activeHabits.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No active habits</p>
            <Button variant="outline" onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first habit
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {activeHabits.map((habit) => {
              const Icon = habitIcons[habit.type] || Target;
              
              return (
                <Card key={habit.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{habit.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {habit.frequency}
                        </Badge>
                        {habit.target && habit.unit && (
                          <span>Target: {habit.target} {habit.unit}</span>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditHabit(habit.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleArchive(habit.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Archived Habits */}
      {archivedHabits.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Archived
          </h2>
          
          <div className="space-y-2">
            {archivedHabits.map((habit) => {
              const Icon = habitIcons[habit.type] || Target;
              
              return (
                <Card key={habit.id} className="p-4 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{habit.title}</p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReactivate(habit.id)}
                    >
                      Reactivate
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Habit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingHabit ? "Edit Habit" : "Add New Habit"}
            </DialogTitle>
            <DialogDescription>
              {editingHabit 
                ? "Update your habit details" 
                : "Create a new habit to track daily"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Habit Title</Label>
              <Input
                id="title"
                placeholder="e.g., Walk 30 minutes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Category</Label>
              <Select value={type} onValueChange={(v) => setType(v as HabitType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {habitTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target (optional)</Label>
                <Input
                  id="target"
                  type="number"
                  placeholder="e.g., 30"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit (optional)</Label>
                <Input
                  id="unit"
                  placeholder="e.g., minutes"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingHabit ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PaywallDialog 
        open={showPaywall} 
        onOpenChange={setShowPaywall}
        trigger="habit_limit"
      />
    </div>
  );
}
