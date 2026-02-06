import { useMemo } from "react";

const NOTE_ORDER = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
];

const getNoteRank = (keyString: string) => {
  if (!keyString) return 999;

  const match = keyString.match(/^([A-G][#b]?)/i);

  if (!match) return 999;

  const note = match[1];

  const index = NOTE_ORDER.findIndex(
    (n) => n.toLowerCase() === note.toLowerCase()
  );

  return index === -1 ? 999 : index;
};

export const useSortedKeys = (items: { id: number; name: string }[]) => {
  const sortedKeys = useMemo(() => {
    const itemsCopy = [...items];

    return itemsCopy.sort((a, b) => {
      const rankA = getNoteRank(a.name);
      const rankB = getNoteRank(b.name);

      if (rankA === rankB) {
        return a.name.localeCompare(b.name);
      }

      return rankA - rankB;
    });
  }, [items]);

  return sortedKeys;
};
