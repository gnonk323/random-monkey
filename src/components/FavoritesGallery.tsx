import type { MonkeyImageType } from "@/types/types";
import { GalleryMonkeyImage } from "./MonkeyImage";

export default function FavoritesGallery({ monkeyImages }: { monkeyImages: MonkeyImageType[] }) {
  return (
    <>
    {monkeyImages.length > 0 ? (
      <div className="columns-1 md:columns-2 gap-4">
        {monkeyImages.map((monkeyImage: MonkeyImageType) => (
          <div key={monkeyImage.url} className="mb-2 break-inside-avoid">
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