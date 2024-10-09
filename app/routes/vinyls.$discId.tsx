import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { VinylDetails } from "~/components/vinyl-details";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const token = process.env.DISCOGS_API_TOKEN;
  const username = process.env.DISCOGS_USERNAME; // Add your Discogs username to the .env file

  if (!token || !username) {
    throw new Error("Discogs token or username is not provided.");
  }

  // Discogs API URL to fetch the user's collection from the default folder (folder_id=0)
  const discogsApiUrl = `https://api.discogs.com/releases/${params.discId}?token=${token}`;

  const response = await fetch(discogsApiUrl);

  if (!response.ok) {
    throw new Error("Error fetching collection from Discogs");
  }

  const data = await response.json();
  console.log(JSON.stringify(data));
  return json(data); // Pass the collection data to the component
};

export default function Index() {
  const vinyl = useLoaderData<typeof loader>();

  return (
    <>
      <VinylDetails vinyl={vinyl} />
    </>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex gap-8">
        <div>
          <h1 className="text-4xl text-gray-800 font-bold mb-2">{title}</h1>
          <p className="text-xl text-gray-700 mb-2">{artists[0]?.name}</p>
          <p className="text-md text-gray-600 mb-2">
            Release Date: {year} - {country}
          </p>

          {/* Genres */}
          <div className="mb-4">
            {genres.map((genre, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

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
      </div>
      {/* Notes */}
      {notes && (
        <div className="bg-gray-100 p-4 rounded-md shadow-sm mt-8">
          <p className="text-gray-600 font-semibold mb-2">Notes</p>
          <p className="text-gray-700 text-sm">{notes}</p>
        </div>
      )}
      {/* Tracklist */}
      <div className="mt-8">
        <h2 className="text-gray-800 text-3xl font-semibold mb-4">Tracklist</h2>
        <ul className="list-inside">
          {tracklist.map((track, index) => (
            <li key={index} className="">
              <p className="text-lg text-gray-600">
                {track.position} - {track.title}
                {track.extraartists && track.extraartists.length > 0 && (
                  <span className="text-gray-500 text-sm">
                    {" "}
                    (
                    {track.extraartists.map((artist) => artist.name).join(", ")}
                    )
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Videos */}
      {videos && videos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl font-semibold mb-4">Related Videos</h2>
          <div className="flex gap-8">
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
  );
}
