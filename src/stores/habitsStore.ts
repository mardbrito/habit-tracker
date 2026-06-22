import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSameDay } from "date-fns";

export type Habit = { id: string; name: string; completions: Date[] };

type HabitsState = {
  habits: Habit[];
  addHabit: (name: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: Date) => void;
};

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: [],
      addHabit: (name) =>
        set((state) => ({
          habits: [
            ...state.habits,
            { id: crypto.randomUUID(), name, completions: [] },
          ],
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),
      toggleHabit: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;

            const alreadyDone = h.completions.some((c) => isSameDay(c, date));
            const completions = alreadyDone
              ? h.completions.filter((c) => !isSameDay(c, date))
              : [...h.completions, date];

            return { ...h, completions };
          }),
        })),
    }),
    {
      name: "Habits", // chave usada no localStorage
    },
  ),
);
