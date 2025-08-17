import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FavoritesGallery from "@/components/FavoritesGallery";
import type { MonkeyImageType } from "@/types/unsplash";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function Favorites() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/");
  }

  const { data: favorites, error: favError } = await supabase
    .from("favorites")
    .select("image_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (favError) {
    console.error("Failed to fetch favorites:", favError);
    return <div>Error loading favorites</div>;
  }

  const monkeyImages: MonkeyImageType[] = (favorites || []).map(fav => ({
    url: fav.image_url,
    favorite: true,
  }));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-2 items-center justify-between mb-4">
        <Link href={"/"} className="md:hidden block">
          <button className="px-3 py-1 rounded-lg hover:bg-current/25 transition-colors cursor-pointer text-purple-500 font-semibold">
            <ArrowLeft />
          </button>
        </Link>
        <div className="md:text-left text-right">
          <h1 className="font-bold md:text-2xl text-lg">My Favorite Monkeys</h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
        <Link href={"/"} className="md:block hidden">
          <button className="px-3 py-1 rounded-lg hover:bg-current/25 transition-colors cursor-pointer text-purple-500 font-semibold">
            Explore More Monkeys
          </button>
        </Link>
      </div>
      <FavoritesGallery monkeyImages={monkeyImages} />
    </div>
  );
}