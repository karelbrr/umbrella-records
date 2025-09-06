import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  setItemsPerRow: (value: number) => void;
  itemsPerRow: Number;
}

export default function ItemsPerRowButton({
  setItemsPerRow,
  itemsPerRow,
}: Props) {
  return (
    <div className="flex items-center">
      <p className="text-white font-array-bold ">items per row // </p>
      <Select
        value={itemsPerRow.toString()}
        onValueChange={(value) => {
          const numericValue = Number(value);
          setItemsPerRow(numericValue);
          localStorage.setItem("itemsPerRow", numericValue.toString());
        }}
      >
        <SelectTrigger className="w-[45px] hover:cursor-pointer hover:opacity-70 transition border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 bg-transparent hover:bg-transparent">
          <SelectValue placeholder="5" className="!text-white" />
        </SelectTrigger>
        <SelectContent className="!w-[60px] !min-w-[60px]">
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="6">6</SelectItem>
          <SelectItem value="7">7</SelectItem>
          <SelectItem value="8">8</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
