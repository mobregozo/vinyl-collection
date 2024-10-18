import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { VinylListItem } from "~/components/vinyl-list-item";

export const meta: MetaFunction = () => {
  return [
    { title: "My vinyl collection" },
    { name: "description", content: "Welcome to my vinyl collection" },
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
      artist: release.basic_information.artists[0].anv
        ? release.basic_information.artists[0].anv
        : release.basic_information.artists[0].name,
      album: release.basic_information.title,
      year: parseInt(release.basic_information.year),
      cover: release.basic_information.thumb,
    };
  });

  console.log(JSON.stringify(data.releases[1].basic_information.artists[0]));

  return json(albums);
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
    <div className="container mx-auto p-4 space-y-6  dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">My Vinyl Collection</h1>

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

      <div className="sm:grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {filteredAlbums.map((album) => (
          <Link to={`/vinyls/${album.id}`} key={album.id}>
            <VinylListItem album={album} />
          </Link>
        ))}
      </div>
    </div>
  );
}
