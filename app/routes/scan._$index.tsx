import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "components/ui/button";
import { CircleX, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { BarcodeReader } from "~/components/barcode-scanner";
import { Input } from "~/components/ui/input";
import { VinylListItem } from "~/components/vinyl-list-item";

// Loader to fetch search results from the Discogs API
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const barcode = url.searchParams.get("barcode");

  if (!query && !barcode) return json({ results: [] });

  // Get the Discogs API token from the environment variables
  const discogsApiUrl = `https://api.discogs.com/database/search?format=vinyl&token=${
    process.env.DISCOGS_API_TOKEN
  }&type=release${barcode ? `&barcode=${barcode}` : ""}${
    query ? `&q=${query}` : ""
  }`;

  try {
    // Fetch data from the Discogs API
    const response = await fetch(discogsApiUrl);
    const data = await response.json();

    return json({
      results: data.results.map((release) => {
        return {
          id: release.id,
          artist: release.title.split(" - ")[0],
          album: release.title.split(" - ")[1],
          year: parseInt(release.year),
          cover: release.thumb,
        };
      }),
    });
  } catch (error) {
    return json(
      { error: "Error fetching data from Discogs", results: [] },
      { status: 500 }
    );
  }
};

function createQueryParams({ barcode, query }): string {
  const params = new URLSearchParams();

  // Conditionally append `barcode` if provided
  if (barcode) {
    params.append("barcode", barcode);
  }

  // Conditionally append `query` if provided
  if (query) {
    params.append("query", query);
  }

  return params.toString();
}

export default function VinylSearch() {
  const { results, error } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState("");

  const handleSearch = async () => {
    const param = createQueryParams({ barcode, query: searchTerm });

    navigate(`/scan?${param}`);
  };

  const handleClear = () => {
    setBarcode("");
    setSearchTerm("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleBarcodeScan = (result: string) => {
    setBarcode(result);
    const param = createQueryParams({ barcode: result, query: searchTerm });

    navigate(`/scan?${param}`);
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Search for Vinyl Records</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="md:flex md:space-x-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter barcode or search term"
            className="flex-grow"
          />
          <div className="mt-4 w-full md:mt-0 md:w-auto flex space-x-4">
            <Button type="submit" className="w-full">
              <Search className="wmr-2 h-4 w-4" />
              Search
            </Button>
            <Button className="w-full ml-2" onClick={handleClear}>
              <CircleX className="wmr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </form>

      <BarcodeReader onScan={handleBarcodeScan} />

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold col-span-full mb-4">Results:</h3>
          <div className="sm:grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
            {results.slice(0, 10).map((album) => (
              <Link to={`/vinyls/${album.id}`} key={album.id}>
                <VinylListItem album={album} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {results && results.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          There are no items to show
        </div>
      )}
    </div>
  );
}
