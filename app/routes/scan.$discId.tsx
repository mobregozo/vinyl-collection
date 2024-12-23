import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { VinylDetails } from "~/components/vinyl-details";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const token = process.env.DISCOGS_API_TOKEN;
  const username = process.env.DISCOGS_USERNAME; // Add your Discogs username to the .env file

  if (!token || !username) {
    throw new Error("Discogs token or username is not provided.");
  }

  // Discogs API URL to fetch the user's collection from the default folder (folder_id=0)
  const discogsApiUrl = `https://api.discogs.com/releases/${params.discId}?token=${token}`;
  const priceSuggestionsUrl = `https://api.discogs.com//marketplace/stats/${params.discId}?token=${token}`;

  const [response, priceSuggestionsResponse] = await Promise.all([
    fetch(discogsApiUrl),
    fetch(priceSuggestionsUrl),
  ]);

  if (!response.ok) {
    throw new Error("Error fetching collection from Discogs");
  }

  const data = await response.json();
  const priceSuggestions = await priceSuggestionsResponse.json();
  return json({ info: data, priceSuggestions: priceSuggestions });
};

export default function Index() {
  const vinyl = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Link to="/scan" className="flex items-center space-x-2">
          <ArrowLeft className="h-8" />
          <span>Back to scanning</span>
        </Link>
      </div>
      <VinylDetails vinyl={vinyl.info} pricing={vinyl.priceSuggestions} />
    </>
  );
}
