import FavoritesGallery from "@/components/FavoritesGallery";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";

export default async function Favorites() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/");
  }

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
      <Suspense
        fallback={
          <div className="flex items-center justify-center gap-2">
            <LoaderCircle className="animate-spin" />
            <p>Loading favorites...</p>
          </div>
        }
      >
        <FavoritesGallery />
      </Suspense>
    </div>
  );
}
