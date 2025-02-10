import { getLoggedInUser, signInWithGoogle, signOut } from "@/lib/appwrite/server";

export default async function Home() {
  const user = await getLoggedInUser();

  if (!user) {
    return (
      <div>
        <h1>Not logged in</h1>

        <form action={signInWithGoogle}>
          <button type="submit">
            Sign in with Google
          </button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Welcome {user.name}</h1>
        
        <form action={signOut}>
          <button type="submit">
            Sign out
          </button>
        </form>
      </div>
    )
  }
}
