import { Disc, Award, Tag, Clock, Music2 } from "lucide-react";
import { TrackItem } from "~/routes/wishlist_.$id";

type AlbumDetailsProps = {
  genre: string;
  popularity: number;
  label: string;
  tracks: TrackItem[];
};

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
};

export const AlbumDetails = ({
  genre,
  popularity,
  label,
  tracks,
}: AlbumDetailsProps) => (
  <div className="container mx-auto px-4 py-6 space-y-8">
    <div className="bg-neutral-900/30 rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Disc className="w-6 h-6 text-neutral-400" />
        <div>
          <p className="font-medium">Genre</p>
          <p className="text-sm text-neutral-400">{genre}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Award className="w-6 h-6 text-neutral-400" />
        <div>
          <p className="font-medium">Popularity</p>
          <div className="w-48 bg-neutral-800 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${popularity}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Tag className="w-6 h-6 text-neutral-400" />
        <div>
          <p className="font-medium">Label</p>
          <p className="text-sm text-neutral-400">{label}</p>
        </div>
      </div>
    </div>

    <div className="bg-neutral-900/30 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Music2 className="w-5 h-5 text-neutral-400" />
        <h2 className="text-lg font-medium">Track Listing</h2>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-2 text-sm text-neutral-400">
          <span>#</span>
          <span>Title</span>
          <Clock className="w-4 h-4" />
        </div>

        {tracks.map((track) => (
          <div
            key={track.track_number}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 hover:bg-neutral-800/50 rounded-md transition-colors group"
          >
            <span className="w-6 text-neutral-400 text-sm">
              {track.track_number}
            </span>
            <span className="font-medium group-hover:text-white transition-colors">
              {track.name}
            </span>
            <span className="text-sm text-neutral-400">
              {formatDuration(track.duration_ms)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
