import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

type DiscogsRelease = {
  id: number;
  basic_information: {
    title: string;
    year: string;
    thumb: string;
    artists: {
      name: string;
      anv: string;
    }[];
  };
};

export const loader = async ({ params }: { params: { username: string } }) => {
  const token = process.env.DISCOGS_API_TOKEN;
  const { username } = params;

  if (!token || !username) {
    throw new Error("Discogs token or username is not provided.");
  }

  // Discogs API URL to fetch the user's collection from the default folder (folder_id=0)
  // const discogsApiUrl = `https://api.discogs.com/users/${username}/collection/folders/0/releases?token=${token}&page=1&per_page=100`;
  const discogsApiUrl = `https://api.discogs.com/users/${username}/collection/folders/0/releases?token=${token}&page=1&per_page=100`;
  const discogsApiUrlValue = `https://api.discogs.com/users/${username}/collection/value?token=${token}`;

  // const [responseA, responseB];

  const [collectionReleases, collectionValueResponse] = await Promise.all([
    fetch(discogsApiUrl),
    fetch(discogsApiUrlValue),
  ]);

  if (!collectionReleases.ok) {
    throw new Error("Error fetching collection from Discogs");
  }

  if (!collectionValueResponse.ok) {
    throw new Error("Error fetching value from Discogs");
  }

  const collection = await collectionReleases.json();
  const collectionValue = await collectionValueResponse.json();

  return json({
    collectionValue,
    collection,
  });
};

export default function Analytics() {
  const { collectionValue, collection } = useLoaderData<typeof loader>();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Collection Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Minimum Value: {collectionValue.minimum} USD</p>
          <p>Median Value: {collectionValue.median} USD</p>
          <p>Maximum Value: {collectionValue.maximum} USD</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Releases by Year</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Artists</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
}
