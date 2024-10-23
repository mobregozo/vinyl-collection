type VinylListItemProps = {
  album: {
    id: number;
    artist: string;
    album: string;
    year: number;
    cover: string;
    country?: string;
  };
};

export const VinylListItem = ({ album }: VinylListItemProps) => {
  return (
    <div
      key={album.id}
      className="sm:text-center mb-4 sm:mb-0 hover:opacity-70 group flex items-start sm:block gap-6"
      style={{ contentVisibility: "auto" }}
    >
      <img
        src={album.cover}
        alt={`${album.album} by ${album.artist}`}
        className="w-24 h-24 sm:w-full sm:h-full aspect-square shadow-md object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
        style={{ viewTransitionName: album.album }}
      />
      <div>
        <p className="sm:mt-2 text-lg font-semibold sm:text-sm dark:text-gray-200">
          {album.album} ({album.year})
        </p>
        <p className="sm:text-xs text-md text-gray-600 dark:text-gray-400">
          {album.artist}
        </p>
        {album.country && (
          <p className="sm:text-xs text-md text-gray-800 dark:text-gray-200">
            {album.country}
          </p>
        )}
      </div>
    </div>
  );
};
