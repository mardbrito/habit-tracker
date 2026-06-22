import { useState, type SubmitEvent } from "react";
import { Button } from "./Button";
import { useHabitsStore } from "../stores/habitsStore";

export function HabitForm() {
  const addHabit = useHabitsStore((state) => state.addHabit);
  const [name, setName] = useState("");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (name.trim() === "") return;
    addHabit(name);
    setName("");
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-lg bg-zinc-800 px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        placeholder="New habit..."
      />
      <Button
        disabled={name.trim() === ""}
        className="rounded-lg px-4 py-2 font-medium"
      >
        Add Habit
      </Button>
    </form>
  );
}
