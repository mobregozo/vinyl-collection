import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { User } from "@supabase/supabase-js";
import { Button } from "components/ui/button";
import { SearchIcon, Trash2 } from "lucide-react";
import { AlbumCard } from "~/components/album-card";
import { createClient } from "~/utils/supabase/server";

type WishlistItem = {
  id: string;
  external_id: string;
  name: string;
  artist: string;
  year: string;
  image_url: string;
  external_url: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { supa, headers } = createClient({ request });

  const { data, error } = await supa.from("wishlist").select("*");
  if (error) throw new Error("Failed to fetch wishlist");

  const {
    data: { user },
  } = await supa.auth.getUser();

  return json({ wishlist: data, user, headers });
};

export const action: ActionFunction = async ({ request }) => {
  const { supa, headers } = createClient({ request });

  const formData = await request.formData();

  const id = formData.get("id");
  const { error } = await supa.from("wishlist").delete().match({ id });
  if (error) {
    throw new Error("Failed to remove from wishlist");
  }

  return json({ success: true }, { headers });
};

export default function Wishlist() {
  const { wishlist, user } = useLoaderData<{
    wishlist: WishlistItem[];
    user: User | null;
  }>();

  return (
    <div>
      <div className="flex align-middle justify-between mb-12 mt-4">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <Link
          to="/wishlist/search"
          className="font-semibold flex items-center gap-2"
        >
          <SearchIcon className="h-4 w-4" />
          Search for more
        </Link>
      </div>
      <div className="mt-8 text-gray-500 mb-4">
        Data provided by{" "}
        <a href="https://www.spotify.com" className="text-blue-500">
          Spotify
        </a>
      </div>
      <div className="sm:grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {wishlist.map((item) => (
          <AlbumCard key={item.id} album={item}>
            {user && (
              <Form method="post" className="w-full m-auto text-center">
                <input type="hidden" name="id" value={item.id} />
                <Button
                  size="icon"
                  type="submit"
                  variant="secondary"
                  className="rounded-full w-12 h-12 bg-zinc-800 hover:bg-zinc-700 hover:scale-105 transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Form>
            )}
          </AlbumCard>
        ))}
      </div>
    </div>
  );
}
