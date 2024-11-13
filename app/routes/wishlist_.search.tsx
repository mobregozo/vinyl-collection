import { ActionFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { Button } from "components/ui/button";
import { Heart, Search } from "lucide-react";
import { Album, AlbumCard } from "~/components/album-card";
import { Input } from "~/components/ui/input";
import { getSpotifyAccessToken } from "~/utils/spotify-auth";
import { createClient } from "~/utils/supabase/server";

type SpotifyAlbum = {
  id: string;
  name: string;
  artists: { name: string }[];
  release_date: string;
  images: { url: string }[];
  external_urls: { spotify: string };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return json({ albums: [] as Album[], user: null, wishlistSet: [] });
  }
  const { supa, headers } = createClient({ request });

  const {
    data: { user },
  } = await supa.auth.getUser();

  // Get Spotify access token
  const token = await getSpotifyAccessToken();

  // Search Spotify for albums matching the query
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=album`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();

  // Check for errors in the response
  if (!response.ok) {
    throw new Error(`Failed to fetch albums: ${data.error.message}`);
  }

  let wishlistSet: Set<string> = new Set();

  if (user) {
    // Fetch user's wishlist from Supabase
    const { data: wishlist, error } = await supa
      .from("wishlist")
      .select("external_id");

    if (error) {
      throw new Error(`Failed to fetch wishlist: ${error.message}`);
    }
    wishlistSet = new Set(wishlist.map((item) => item.external_id));
  }

  // Map results to a simpler format
  const albums: Album[] = data.albums.items.map((album: SpotifyAlbum) => ({
    id: album.id,
    name: album.name,
    artist: album.artists[0].name,
    year: album.release_date.split("-")[0],
    image_url: album.images[0]?.url || "",
    external_url: album.external_urls.spotify,
    external_id: album.id,
  }));

  return json({
    albums,
    user,
    headers,
    wishlistSet: Array.from(wishlistSet),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const { supa, headers } = createClient({ request });

  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();

  const newItem = {
    user_id: user.id,
    external_id: formData.get("external_id"),
    name: formData.get("name"),
    artist: formData.get("artist"),
    year: formData.get("year"),
    image_url: formData.get("image_url"),
    external_url: formData.get("external_url"),
  };

  const { error } = await supa.from("wishlist").insert(newItem);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ success: true, headers });
};

export default function SearchIndex() {
  const { albums, user, wishlistSet } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Spotify album search</h1>

      <Form method="get" className="space-y-4">
        <div className="md:flex md:space-x-4">
          <Input
            type="text"
            name="query"
            placeholder="Search for an album"
            className="flex-grow bg-white dark:bg-gray-800"
          />
          <div className="mt-4 w-full md:mt-0 md:w-auto flex space-x-4">
            <Button type="submit" className="w-full">
              <Search className="wmr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </Form>

      {albums.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums?.map((album) => (
            <AlbumCard key={album.id} album={album}>
              {user && (
                <Form method="post" className="w-full m-auto text-center">
                  <input type="hidden" name="id" value={album.id} />
                  <input type="hidden" name="name" value={album.name} />
                  <input type="hidden" name="artist" value={album.artist} />
                  <input type="hidden" name="year" value={album.year} />
                  <input
                    type="hidden"
                    name="image_url"
                    value={album.image_url}
                  />
                  <input
                    type="hidden"
                    name="external_url"
                    value={album.external_url}
                  />
                  <input type="hidden" name="external_id" value={album.id} />
                  {wishlistSet.includes(album.external_id) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full w-12 h-12 bg-zinc-800 hover:bg-zinc-700 hover:scale-105 transition-all"
                      disabled
                    >
                      Already in wishlist
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full w-12 h-12 bg-zinc-800 hover:bg-zinc-700 hover:scale-105 transition-all"
                      type="submit"
                      name="_action"
                      value="add"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  )}
                </Form>
              )}
            </AlbumCard>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">
          No albums found. Try a different search.
        </p>
      )}

      <footer className="mt-8 text-gray-500">
        Data provided by{" "}
        <a href="https://www.spotify.com" className="text-blue-500">
          Spotify
        </a>
      </footer>
    </div>
  );
}
