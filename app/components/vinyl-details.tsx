import { ArrowLeft, Play } from "lucide-react";
import { Link } from "@remix-run/react";

export function VinylDetails({ vinyl }) {
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

  return (
    <div className="">
      <Link to="/vinyls" className="inline-flex items-center mb-6 ">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to List
      </Link>
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-stretch">
          <div key={id} className="w-[300px] h-[300px] album">
            {/* Vinyl record */}
            <div className="w-[300px] h-[300px] record-wrapper">
              <div className="w-[270px] h-[270px] record"></div>
            </div>
            {/* Album cover */}
            <div className="w-[300px] h-[300px] record-case">
              <img
                src={images[0]?.resource_url}
                alt={title}
                className="album-cover"
              />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-xl text-gray-600 mb-2">{artists[0]?.name}</p>
              <div className="flex items-center gap-2 mb-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}

                <span className="text-sm text-gray-500">
                  Release Date: {year} - {country}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Notes</h2>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Tracklist</h2>
          <ol className=" list-inside text-gray-700 columns-2 sm:columns-3">
            {tracklist.map((track, index) => (
              <li key={index} className="text-gray-500 text-sm">
                {track.position} - {track.title}
              </li>
            ))}
          </ol>
        </div>
        {videos && videos.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Related Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <div key={index} className="aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-full rounded-sm"
                    src={video.uri.replace("watch?v=", "embed/")}
                    title={video.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
