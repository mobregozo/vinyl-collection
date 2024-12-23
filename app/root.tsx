import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLocation,
  useLoaderData,
} from "@remix-run/react";

import styles from "./tailwind.css?url";

import { ThemeSwitch } from "./components/theme-switch";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { themeSessionResolver } from "./sessions.server";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import clsx from "clsx";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

// Return the theme from the session storage using the loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="mb-4 py-4 border-b border-gray-200 dark:border-gray-700 container mx-auto max-w-4xl flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold text-gray-800 dark:text-white group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          id="Layer_1"
          width="512"
          height="512"
          viewBox="0 0 512 512"
          className="transition-transform duration-300 ease-in-out w-8 h-8 group-hover:animate-spin"
          enableBackground="new 0 0 512 512"
        >
          <g id="vinyl_record">
            <g>
              <path
                fill="#434A54"
                d="M256,0C114.609,0,0,114.617,0,256c0,141.375,114.609,256,256,256c141.375,0,256-114.625,256-256    C512,114.617,397.375,0,256,0z M256,266.664c-5.891,0-10.672-4.773-10.672-10.664s4.781-10.664,10.672-10.664    s10.656,4.773,10.656,10.664S261.891,266.664,256,266.664z"
              />
            </g>
            <g>
              <path
                fill="#656D78"
                d="M197.875,118.391c18.391-7.781,37.953-11.727,58.125-11.727c5.891,0,10.656-4.773,10.656-10.664    S261.891,85.336,256,85.336c-94.266,0-170.672,76.406-170.672,170.664c0,5.891,4.781,10.664,10.672,10.664    s10.656-4.773,10.656-10.664c0-20.172,3.953-39.727,11.734-58.117c7.516-17.781,18.297-33.758,32.016-47.477    S180.094,125.914,197.875,118.391z"
              />
              <path
                fill="#656D78"
                d="M314.109,393.609c-18.391,7.781-37.938,11.734-58.109,11.734c-5.891,0-10.672,4.766-10.672,10.656    s4.781,10.656,10.672,10.656c94.25,0,170.656-76.406,170.656-170.656c0-5.891-4.766-10.664-10.656-10.664    s-10.672,4.773-10.672,10.664c0,20.172-3.938,39.719-11.719,58.125c-7.531,17.781-18.297,33.75-32.016,47.469    S331.891,386.094,314.109,393.609z"
              />
              <path
                fill="#656D78"
                d="M181.266,79.078C204.922,69.07,230.062,64,256,64c5.891,0,10.656-4.773,10.656-10.664    S261.891,42.664,256,42.664C138.172,42.664,42.656,138.18,42.656,256c0,5.891,4.781,10.664,10.672,10.664S64,261.891,64,256    c0-25.93,5.062-51.07,15.078-74.727c9.672-22.859,23.516-43.398,41.156-61.039S158.406,88.75,181.266,79.078z"
              />
              <path
                fill="#656D78"
                d="M256,149.336c5.891,0,10.656-4.781,10.656-10.672S261.891,128,256,128l0,0c-70.703,0-128,57.305-128,128    c0,5.891,4.766,10.664,10.656,10.664s10.672-4.773,10.672-10.664c0-28.492,11.094-55.281,31.234-75.422    c20.156-20.148,46.938-31.242,75.422-31.242H256z"
              />
              <path
                fill="#656D78"
                d="M245.328,373.344c0,5.875,4.781,10.656,10.672,10.656c70.688,0,128-57.312,128-128    c0-5.891-4.781-10.664-10.672-10.664s-10.672,4.773-10.672,10.664c0,28.5-11.094,55.281-31.234,75.422    S284.484,362.656,256,362.656C250.109,362.656,245.328,367.438,245.328,373.344z"
              />
              <path
                fill="#656D78"
                d="M458.656,245.336c-5.891,0-10.656,4.773-10.656,10.664c0,25.938-5.078,51.062-15.078,74.719    c-9.672,22.875-23.516,43.406-41.156,61.047s-38.188,31.484-61.047,41.156C307.062,442.938,281.922,448,256,448    c-5.891,0-10.672,4.781-10.672,10.656c0,5.906,4.781,10.688,10.672,10.688c117.812,0,213.328-95.531,213.328-213.344    C469.328,250.109,464.547,245.336,458.656,245.336z"
              />
            </g>
            <path
              fill="#ED5564"
              d="M256,181.336c-41.172,0-74.672,33.492-74.672,74.664s33.5,74.656,74.672,74.656   s74.656-33.484,74.656-74.656S297.172,181.336,256,181.336z M256,266.664c-5.891,0-10.672-4.773-10.672-10.664   s4.781-10.664,10.672-10.664s10.656,4.773,10.656,10.664S261.891,266.664,256,266.664z"
            />
            <path
              fill="#DA4453"
              d="M256,170.664c-47.125,0-85.344,38.211-85.344,85.336s38.219,85.344,85.344,85.344   s85.328-38.219,85.328-85.344S303.125,170.664,256,170.664z M256,320c-35.297,0-64-28.719-64-64c0-35.289,28.703-64,64-64   c35.281,0,64,28.711,64,64C320,291.281,291.281,320,256,320z"
            />
          </g>
        </svg>
      </Link>
      <nav className="flex items-center space-x-6">
        <Link
          to="/scan"
          className={`text-sm font-medium transition-colors duration-200 ${
            isActive("/scan")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          }`}
        >
          Scan
        </Link>
        <Link
          to="/wishlist"
          className={`text-sm font-medium transition-colors duration-200 ${
            isActive("/wishlist")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          }`}
        >
          Wishlist
        </Link>
        <Link
          to="/vinyls"
          className={`text-sm font-medium transition-colors duration-200 ${
            isActive("/vinyls")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          }`}
        >
          My Collection
        </Link>
        <ThemeSwitch />
      </nav>
    </header>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html lang="en" data-theme={theme ?? ''} className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
        <script
          defer
          data-domain="vinyl-collection-rho.vercel.app"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body className="bg-gray-100 dark:bg-gray-900">
        <main className="container px-4 max-w-4xl mx-auto pb-8 flex flex-col min-h-screen">
          <Header />
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
