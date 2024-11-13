import { Link } from "@remix-run/react";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { PropsWithChildren, useState } from "react";

export type Album = {
  id: string;
  external_id: string;
  name: string;
  artist: string;
  year: string;
  image_url: string;
  external_url: string;
};

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({
  album,
  children,
}: PropsWithChildren<AlbumCardProps>) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link to={`/wishlist/${album.external_id}`}>
      <Card
        className="h-full group relative p-0 overflow-hidden bg-zinc-900 border-zinc-800 transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="relative p-0 h-full flex flex-col">
          <div className="relative aspect-square">
            <img
              src={album.image_url}
              alt={`${album.name} by ${album.artist}`}
              className="object-cover w-full"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2">
                {children}
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col h-full text-center">
            <h3 className="font-semibold text-sm text-white truncate">
              {album.name}
            </h3>
            <div className="flex items-center justify-between mt-1 mb-3 mx-auto flex-1">
              <p className="text-sm text-zinc-400 text-center">
                {album.artist} ({album.year})
              </p>
            </div>
            <a
              href={album.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="default"
                size="sm"
                className="w-full  bg-[#1DB954] hover:bg-[#1ed760] text-white"
              >
                Listen on Spotify
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
