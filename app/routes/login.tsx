import { ActionFunction, json } from "@remix-run/node";
import { useActionData, Form, useLoaderData } from "@remix-run/react";
import { createClient } from "~/utils/supabase/server";

type ActionData = {
  error?: string;
};

export const loader = async ({ request }) => {
  const { supa } = createClient({ request });

  const { data, error } = await supa.auth.getUser();

  if (error) {
    return json({ user: null });
  }

  return json({ user: data.user?.email });
};

// export const action: ActionFunction = async ({ request }) => {
//   const { supa, headers } = createClient({ request });

//   const formData = await request.formData();
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   const userData = await supa.auth.getUser();

//   if (userData) {
//     return { user: userData.data.user?.email };
//   }

//   // Verifica credenciales de Supabase
//   const { data, error } = await supa.auth.signInWithPassword({
//     email,
//     password,
//   });

//   // Si hay un error de autenticación, retorna un mensaje de error
//   if (error) {
//     return json<ActionData>({ error: error.message }, { status: 400 });
//   }

//   // Redirige a la página de inicio (o a la ruta deseada) si la autenticación es exitosa
//   return json({ success: true }, { headers });
//   //   return redirect("/");
// };

export const action: ActionFunction = async ({ request }) => {
  const { supa, headers } = createClient({ request });

  const formData = await request.formData();
  const actionType = formData.get("_action") as string;

  if (actionType === "signOut") {
    const { error } = await supa.auth.signOut();
    if (error) {
      return json<ActionData>({ error: error.message }, { status: 400 });
    }
    return json({ success: true }, { headers });
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supa.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return json<ActionData>({ error: error.message }, { status: 400 });
  }

  return json({ success: true }, { headers });
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const { user } = useLoaderData<{ user: string }>();

  return (
    <div className="login-form">
      {user ? (
        <p>
          You are already signed in as {user}.
          <Form method="post">
            <input type="hidden" name="actionType" value="signOut" />
            <button
              type="submit"
              name="_action"
              value="signOut"
              className="bg-red-500 text-white p-2 rounded"
            >
              Sign out
            </button>
          </Form>
        </p>
      ) : (
        <>
          <h1>Sign in</h1>
          <Form method="post">
            <label>
              Email:
              <input
                type="email"
                name="email"
                required
                className="border p-2 rounded text-black"
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                required
                className="border p-2 rounded text-black"
              />
            </label>
            <button
              type="submit"
              name="_action"
              value="signIn"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Iniciar sesión
            </button>
          </Form>
          {actionData?.error && (
            <p className="text-red-500 mt-2">{actionData.error}</p>
          )}
        </>
      )}
    </div>
  );
}
