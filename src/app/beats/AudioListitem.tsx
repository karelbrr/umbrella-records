import WaveSurferPlayer from "./WaweSurferPlayer";

function AudioListItem() {
  return (
    <div className="mt-10  flex items-center flex-col ">
      <img
        src="https://upload.wikimedia.org/wikipedia/en/9/95/Beat_-_Original_Vinyl_Cover.jpeg"
        alt=""
      />
      <p className="text-lg font-array-bold text-white mt-3  font-light">
        name // <span className="font-normal">markuv beat</span>
      </p>
      <p className=" font-array-bold text-white  font-light">
        genre // <span className="font-normal">drill</span>{" "}
      </p>
      <p className=" font-array-bold text-white  font-light">
        bpm // <span className="font-normal">120</span>{" "}
      </p>
    </div>
  );
}

export default AudioListItem;
