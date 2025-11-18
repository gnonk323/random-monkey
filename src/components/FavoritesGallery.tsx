import type { MonkeyImageType } from "@/types/types";
import { GalleryMonkeyImage } from "./MonkeyImage";
import { createClient } from "@/lib/supabase/server";

export default async function FavoritesGallery() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) return <p className="text-center">Unauthorized</p>;

  const { data: favorites, error: favoritesError } = await supabase
    .from("favorites")
    .select("image_url, image_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (favoritesError) throw new Error(favoritesError.message);

  const monkeyImages: MonkeyImageType[] = (favorites || []).map((fav) => ({
    id: fav.image_id,
    url: fav.image_url,
    favorite: true,
  }));

  return (
    <>
      {monkeyImages.length > 0 ? (
        <div className="columns-1 md:columns-2 gap-4">
          {monkeyImages.map((monkeyImage: MonkeyImageType) => (
            <div key={monkeyImage.id} className="mb-2 break-inside-avoid">
              <GalleryMonkeyImage monkeyImage={monkeyImage} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No favorites yet...</p>
      )}
    </>
  );
}
