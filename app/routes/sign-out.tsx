import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createClient } from "~/utils/supabase/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supa, headers } = createClient({ request });
  // check if user is logged in
  const {
    data: { session },
  } = await supa.auth.getSession();
  if (!session?.user) {
    return redirect("/");
  }
  // sign out
  await supa.auth.signOut();
  return redirect("/", {
    headers,
  });
};
