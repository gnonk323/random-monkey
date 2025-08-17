import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FavoritesGallery from "@/components/FavoritesGallery";
import type { MonkeyImageType } from "@/types/unsplash";
import Link from "next/link";

export default async function Favorites() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/");
  }

  const { data: favorites, error: favError } = await supabase
    .from("favorites")
    .select("image_url")
    .eq("user_id", user.id);

  if (favError) {
    console.error("Failed to fetch favorites:", favError);
    return <div>Error loading favorites</div>;
  }

  const monkeyImages: MonkeyImageType[] = (favorites || []).map(fav => ({
    url: fav.image_url,
    favorite: true,
  }));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex gap-2 items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">My Favorite Monkeys</h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
        <Link href={"/"}>
          <button className="px-3 py-1 rounded-lg hover:bg-current/25 transition-colors cursor-pointer text-purple-500 font-semibold">
            Explore More Monkeys
          </button>
        </Link>
      </div>
      <br />
      <FavoritesGallery monkeyImages={monkeyImages} />
    </div>
  );
}