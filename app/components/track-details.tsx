import {
  Heart,
  MoreHorizontal,
  Play,
  Share2,
  Music4,
  Radio,
  ListMusic,
} from "lucide-react";

// Mock data structure matching Spotify's API
const trackData = {
  name: "Midnight Rain",
  album: {
    name: "Midnights",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop",
      },
    ],
    release_date: "2022-10-21",
  },
  artists: [{ name: "Taylor Swift", id: "1" }],
  duration_ms: 174728,
  popularity: 85,
};

export const TrackDetails = () => {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="w-64 h-64 shrink-0">
            <img
              src={trackData.album.images[0].url}
              alt={trackData.album.name}
              className="w-full h-full object-cover shadow-2xl rounded-md"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Song</p>
              <h1 className="text-5xl font-bold tracking-tight">
                {trackData.name}
              </h1>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <img
                src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=100&auto=format&fit=crop"
                alt={trackData.artists[0].name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium hover:underline cursor-pointer">
                {trackData.artists[0].name}
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-400">{trackData.album.name}</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-400">
                {new Date(trackData.album.release_date).getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-6">
          <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
            <Play className="w-7 h-7 fill-black text-black ml-1" />
          </button>

          <button className="w-10 h-10 flex items-center justify-center hover:text-white text-neutral-400 transition-colors">
            <Heart className="w-7 h-7" />
          </button>

          <button className="w-10 h-10 flex items-center justify-center hover:text-white text-neutral-400 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>

          <button className="w-10 h-10 flex items-center justify-center hover:text-white text-neutral-400 transition-colors">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Track Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-neutral-900/30 rounded-lg p-4">
          <div className="flex items-center justify-between hover:bg-neutral-800/50 p-3 rounded-md transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Music4 className="w-10 h-10 text-neutral-400" />
              <div>
                <p className="font-medium">Lyrics</p>
                <p className="text-sm text-neutral-400">
                  Sing along with time-synced lyrics
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between hover:bg-neutral-800/50 p-3 rounded-md transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Radio className="w-10 h-10 text-neutral-400" />
              <div>
                <p className="font-medium">Artist Radio</p>
                <p className="text-sm text-neutral-400">
                  Similar songs based on this artist
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between hover:bg-neutral-800/50 p-3 rounded-md transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <ListMusic className="w-10 h-10 text-neutral-400" />
              <div>
                <p className="font-medium">Add to Playlist</p>
                <p className="text-sm text-neutral-400">
                  Save this track to a playlist
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between text-sm text-neutral-400 px-4 py-2">
            <span>Popularity</span>
            <div className="w-32 bg-neutral-800 rounded-full h-1.5 mt-2">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${trackData.popularity}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-sm text-neutral-400 px-4 py-2">
            <span>Duration</span>
            <span>{formatDuration(trackData.duration_ms)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
