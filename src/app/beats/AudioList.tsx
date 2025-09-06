import AudioListItem from "./AudioListitem";

interface Props {
  itemsPerRow: number
}

export function AudioList({itemsPerRow}: Props) {
  return (
    <div className={`grid grid-cols-${itemsPerRow} gap-x-10`}>
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
    </div>
  );
}
