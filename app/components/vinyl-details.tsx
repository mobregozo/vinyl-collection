type VinylDetailsProps = {
  vinyl: {
    id: number;
    title: string;
    artists: { name: string }[];
    year: number;
    genres: string[];
    images: { resource_url: string }[];
    tracklist: { position: string; title: string }[];
    notes: string;
    country: string;
    videos: { uri: string; title: string }[];
  };
  pricing?: {
    num_for_sale: number;
    lowest_price: {
      value: number;
      currency: string;
    };
  };
};

export function VinylDetails({ vinyl, pricing }: VinylDetailsProps) {
  const {
    id,
    title,
    artists,
    year,
    genres,
    images,
    tracklist,
    notes,
    country,
    videos,
  } = vinyl;

  const formatCurrency = ({
    value,
    currency,
  }: {
    value: number;
    currency: string;
  }) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  };

  return (
    <div className="mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-stretch">
        <div>
          <div className="p-4 bg-gray-900 dark:bg-foreground rounded-lg">
            <div className=" ">
              <img
                src={images[0]?.resource_url}
                alt={title}
                className="object-cover w-64 h-64 rounded-lg overflow-hidden"
                style={{ viewTransitionName: title }}
              />
            </div>
            {pricing && (
              <div className="text-white dark:text-gray-700 mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">Vinyl market pulse</h2>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="">
                      Available on <strong>Discogs</strong>
                    </span>
                    {pricing.num_for_sale}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Lowest Price</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        {formatCurrency({
                          value: pricing.lowest_price.value,
                          currency: pricing.lowest_price.currency,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-4 z-50">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              {artists[0]?.name}
            </p>
            <div className="flex items-center gap-2 mb-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-200">
              Release Date: {year} - {country}
            </div>
          </div>
          {notes && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Notes</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-break-spaces">
                {notes}
              </p>
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Tracklist</h2>
        <ol className=" list-inside columns-2 sm:columns-3">
          {tracklist.map((track, index) => (
            <li
              key={index}
              className="text-gray-500 dark:text-gray-200 text-sm"
            >
              {track.position} - {track.title}
            </li>
          ))}
        </ol>
      </div>
      {videos && videos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className="aspect-w-16 aspect-h-9 border-2 rounded-md"
              >
                <iframe
                  className="w-full h-full rounded-sm"
                  src={video.uri.replace("watch?v=", "embed/")}
                  title={video.title}
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
