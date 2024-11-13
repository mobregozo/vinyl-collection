import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getSpotifyAccessToken } from "~/utils/spotify-auth";
import { AlbumDetails } from "~/components/album-detail";
import { AlbumHeader } from "~/components/album-header";

type Image = {
  url: string;
  height: number;
  width: number;
};

type Artist = {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type TrackItem = {
  track_number: number;
  name: string;
  duration_ms: number;
};

export type Tracks = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: TrackItem[];
};

type Copyright = {
  text: string;
  type: string;
};

type ExternalIds = {
  upc: string;
};

type Album = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: Artist[];
  tracks: Tracks;
  copyrights: Copyright[];
  external_ids: ExternalIds;
  genres: string[];
  label: string;
  popularity: number;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const albumId = params.id;
  if (!albumId) throw new Error("Album ID is required");

  const token = await getSpotifyAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // console.error(response.status, response.statusText);
    throw new Error("Failed to fetch album data from Spotify");
  }

  const album = await response.json();
  return json({ album: album as Album });
};

export default function AlbumDetail() {
  const { album } = useLoaderData<typeof loader>();
  return (
    <div>
      <AlbumHeader
        imageUrl={album.images[0].url}
        albumName={album.name}
        artistName={album.artists[0].name}
        releaseDate={album.release_date}
        spotifyUrl={album.external_urls.spotify}
      />

      <AlbumDetails
        genre={album.genres[0]}
        popularity={album.popularity}
        label={album.label}
        tracks={album.tracks.items}
      />

      {/* <WishlistNote note={album.wishlistNote} addedDate={album.addedDate} /> */}
    </div>
  );
}
