import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { track, EVENTS } from "@/lib/events";
import { Sparkles, TrendingUp, PartyPopper } from "lucide-react";

interface CelebrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedCount: number;
  totalCount: number;
}

export function CelebrationDialog({ open, onOpenChange, completedCount, totalCount }: CelebrationDialogProps) {
  const navigate = useNavigate();
  const isFullCompletion = completedCount === totalCount;

  // Track dialog shown
  useEffect(() => {
    if (open) {
      track(EVENTS.DAY_COMPLETION_DIALOG_SHOWN, {
        completedCount,
        totalCount,
        isFullCompletion
      });
    }
  }, [open, completedCount, totalCount, isFullCompletion]);

  const handleViewInsights = () => {
    track(EVENTS.DAY_COMPLETION_VIEW_INSIGHTS_CLICKED);
    onOpenChange(false);
    navigate("/insights");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="py-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-400">
            {isFullCompletion ? (
              <PartyPopper className="h-8 w-8 text-primary-foreground" />
            ) : (
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {isFullCompletion ? "Perfect Day! 🎉" : "Great Progress! 💪"}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {isFullCompletion
              ? "You completed all your habits today. Keep up the amazing work!"
              : `You completed ${completedCount} of ${totalCount} habits. Every step counts!`}
          </p>

          <div className="flex flex-col gap-3">
            <Button variant="default" onClick={handleViewInsights}>
              <TrendingUp className="mr-2 h-4 w-4" />
              View Insights
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>

        {/* Simple confetti effect */}
        {isFullCompletion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'][i % 4],
                  animationDelay: `${Math.random() * 0.5}s`,
                  top: '-10px',
                }}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
