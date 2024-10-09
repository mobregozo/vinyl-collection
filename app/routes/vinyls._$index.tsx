import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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

  const albums = data.releases.map((release: any) => {
    return {
      id: release.id,
      artist: release.basic_information.artists[0].name,
      album: release.basic_information.title,
      year: parseInt(release.basic_information.year),
      cover: release.basic_information.cover_image,
    };
  });

  return json(albums); // Pass the collection data to the component
};

// Decade quick filters
const decades = [
  { label: "70s", filter: (year) => year >= 1970 && year < 1980 },
  { label: "80s", filter: (year) => year >= 1980 && year < 1990 },
  { label: "90s", filter: (year) => year >= 1990 && year < 2000 },
  { label: "00+", filter: (year) => year >= 2000 },
];

export default function Index() {
  const albums = useLoaderData<typeof loader>();

  const [artistFilter, setArtistFilter] = useState("");
  const [albumFilter, setAlbumFilter] = useState("");
  const [activeDecades, setActiveDecades] = useState<string[]>([]);

  const toggleDecade = (decade: string) => {
    setActiveDecades((prev) =>
      prev.includes(decade)
        ? prev.filter((d) => d !== decade)
        : [...prev, decade]
    );
  };

  const filteredAlbums = albums.filter((album) => {
    const matchesArtist = album.artist
      .toLowerCase()
      .includes(artistFilter.toLowerCase());
    const matchesAlbum = album.album
      .toLowerCase()
      .includes(albumFilter.toLowerCase());
    const matchesDecade =
      activeDecades.length === 0 ||
      activeDecades.some((decade) =>
        decades.find((d) => d.label === decade)?.filter(album.year)
      );
    return matchesArtist && matchesAlbum && matchesDecade;
  });

  return (
    <div className="container mx-auto p-4 space-y-6 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">My Album Collection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="artist" className="dark:text-gray-300">
            Artist
          </Label>
          <Input
            id="artist"
            placeholder="Filter by artist..."
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="album" className="dark:text-gray-300">
            Album
          </Label>
          <Input
            id="album"
            placeholder="Filter by album name..."
            value={albumFilter}
            onChange={(e) => setAlbumFilter(e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="dark:text-gray-300">Filter by decade</Label>
        <div className="flex flex-wrap gap-2">
          {decades.map((decade) => (
            <Badge
              key={decade.label}
              variant={
                activeDecades.includes(decade.label) ? "default" : "outline"
              }
              className="cursor-pointer dark:hover:bg-gray-700"
              onClick={() => toggleDecade(decade.label)}
            >
              {decade.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {filteredAlbums.map((album) => (
          <Link to={`/vinyls/${album.id}`} key={album.id}>
            <div key={album.id} className="text-center">
              <div className="w-full aspect-square overflow-hidden rounded-md shadow-md">
                <img
                  src={album.cover}
                  alt={`${album.album} by ${album.artist}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 font-semibold text-sm dark:text-gray-200">
                {album.album} ({album.year})
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {album.artist}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// export default function Index() {
//   const data = useLoaderData<typeof loader>();

//   return (
//     <div className="container mx-auto py-8">
//       <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 justify-center">
//         {data.releases.map((release) => (
//           <Link to={`/vinyls/${release.id}`} key={release.id}>
//             <div className="text-center">
//               <img
//                 src={release.basic_information.cover_image}
//                 alt={release.basic_information.title}
//                 className="w-full h-auto rounded-md shadow-md"
//               />
//               <p className="mt-2 font-semibold text-sm">
//                 {release.basic_information.title} (
//                 {release.basic_information.year})
//               </p>
//               <p className="text-xs text-gray-600">
//                 {release.basic_information.artists[0].name}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
