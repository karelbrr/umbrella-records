
interface Props {
  id: string;
  itemsPerRow: number;
  name: string;
  bpm: number;
}

function AudioListItem({ itemsPerRow, name, bpm, id }: Props) {
  return (
    <a href={`/beats/${id}`} className="hover:opacity-80 transition">
      <div className="mt-10  flex items-center flex-col ">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/No-album-art.png"
          alt=""
        />
        <p
          className={`text-lg ${
            itemsPerRow === 5
              ? "max-w-64"
              : itemsPerRow === 6
              ? "max-w-52"
              : itemsPerRow === 7
              ? "max-w-40"
              : itemsPerRow === 8
              ? "max-w-32"
              : "max-w-56"
          }  font-satoshi font-light truncate text-white mt-3`}
        >
          <span className="font-normal">{name}</span>
        </p>
        <p className=" font-satoshi font-light text-white">
          genre // <span className="font-normal">--</span>
        </p>
        <p className=" font-satoshi font-light text-white">
          bpm // <span className="font-normal">{bpm}</span>{" "}
        </p>
      </div>
    </a>
  );
}

export default AudioListItem;
