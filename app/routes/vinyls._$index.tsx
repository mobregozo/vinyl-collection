import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const token = process.env.DISCOGS_API_TOKEN;
  const username = process.env.DISCOGS_USERNAME; // Add your Discogs username to the .env file

  if (!token || !username) {
    throw new Error("Discogs token or username is not provided.");
  }

  // Discogs API URL to fetch the user's collection from the default folder (folder_id=0)
  const discogsApiUrl = `https://api.discogs.com/users/${username}/collection/folders/0/releases?token=${token}&page=1&per_page=100`;

  const response = await fetch(discogsApiUrl);

  if (!response.ok) {
    throw new Error("Error fetching collection from Discogs");
  }

  const data = await response.json();

  return json(data); // Pass the collection data to the component
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-6 gap-6">
        {data.releases.map((release) => (
          <Link to={`/vinyls/${release.id}`} key={release.id}>
            <div className="album group relative">
              <div className="record-case hidden group-hover:absolute group-hover:block">
                {release.basic_information.title}
              </div>
              <div className="record-case overflow-hidden">
                <img
                  src={release.basic_information.cover_image}
                  alt={release.basic_information.title}
                  className="album-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
