import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "components/ui/button";
import { Album, Disc } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "My Vinyl Website" },
    { name: "description", content: "Welcome to the Vinyl App" },
  ];
};

const links = [
  { to: "/scan", label: "Scan Vinyl", icon: Disc },
  { to: "/vinyls", label: "My Collection", icon: Album },
];

export default function Index() {
  return (
    <div className="flex items-center justify-center h-full flex-1">
      <div className="grid grid-cols-2 gap-6">
        {links.map(({ to, label, icon: Icon }) => (
          <Link to={to} key={to}>
            <Button
              variant="outline"
              className="w-40 h-40 flex flex-col items-center justify-center text-base font-bold transition-all duration-300 border-black text-black dark:border-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black group relative overflow-hidden"
            >
              <Icon className="w-10 h-10 mb-3" />
              {label}
              <span className="absolute inset-0 border-2 border-black dark:border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
