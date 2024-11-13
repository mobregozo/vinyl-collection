import { ExternalLink } from "lucide-react";

type AlbumHeaderProps = {
  imageUrl: string;
  albumName: string;
  artistName: string;
  releaseDate: string;
  spotifyUrl: string;
};

export const AlbumHeader = ({
  imageUrl,
  albumName,
  artistName,
  releaseDate,
  spotifyUrl,
}: AlbumHeaderProps) => (
  <div className="container mx-auto px-4 pt-16 pb-8">
    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
      <div className="relative group">
        <div className="w-72 h-72 shrink-0">
          <img
            src={imageUrl}
            alt={albumName}
            className="w-full h-full object-cover shadow-2xl rounded-md"
          />
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white flex items-center gap-2 hover:text-green-400 transition-colors"
          >
            <ExternalLink className="w-6 h-6" />
            <span>Open in Spotify</span>
          </a>
        </div>
      </div>

      <div className="flex-1 space-y-4 text-center md:text-left">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-400">Album</p>
          <h1 className="text-4xl font-bold tracking-tight">{albumName}</h1>
        </div>

        <div className="space-y-1">
          <p className="text-xl font-medium">{artistName}</p>
          <p className="text-neutral-400">
            Released {new Date(releaseDate).getFullYear()}
          </p>
        </div>
      </div>
    </div>
  </div>
);
