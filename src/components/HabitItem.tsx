import { format, isFuture, isSameDay, subDays } from "date-fns";
import { Button } from "./Button";
import { useHabitsStore, type Habit } from "../stores/habitsStore";

type HabitItemProps = {
  habit: Habit;
  visibleDates: Date[];
};

export function HabitItem({ habit, visibleDates }: HabitItemProps) {
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  const toggleHabit = useHabitsStore((state) => state.toggleHabit);
  const streak = getStreak(habit.completions);

  return (
    <div className="rounded-xl bg-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">{habit.name}</span>
          {streak !== 0 && (
            <span className="text-sm text-amber-400"> 🔥 {streak}</span>
          )}
        </div>
        <Button
          onClick={() => deleteHabit(habit.id)}
          variant="ghost-destructive"
          className="text-sm"
        >
          Delete
        </Button>
      </div>
      <div className="flex gap-1.5">
        {visibleDates.map((date) => (
          <Button
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg text-xs"
            key={date.toISOString()}
            disabled={isFuture(date)}
            onClick={() => toggleHabit(habit.id, date)}
            variant={
              habit.completions.some((d) => isSameDay(date, d))
                ? "primary"
                : "secondary"
            }
          >
            <span className="font-medium">{format(date, "EEE")}</span>
            <span>{format(date, "d")}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

function getStreak(completions: (Date | string)[]) {
  if (completions.length === 0) return 0;

  const dates = completions.map((c) =>
    typeof c === "string" ? new Date(c) : c,
  );

  const sorted = dates.sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;
  let date = sorted[0];

  while (dates.some((c) => isSameDay(c, subDays(date, 1)))) {
    streak++;
    date = subDays(date, 1);
  }

  return streak;
}
