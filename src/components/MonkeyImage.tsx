import type { MonkeyImageType } from "@/types/unsplash";
import FavoriteToggle from "./FavoriteToggle";

export function MonkeyImage({ monkeyImage, authenticated }: { monkeyImage: MonkeyImageType, authenticated: boolean }) {
  return (
    <div className="relative group inline-block">
      <img
        src={monkeyImage.url}
        alt="Random monkey"
        className="rounded-lg max-h-[70vh] h-auto w-auto"
      />
      {authenticated && <FavoriteToggle key={monkeyImage.url} monkeyImage={monkeyImage} />}
    </div>
  );
}

export function GalleryMonkeyImage({ monkeyImage }: { monkeyImage: MonkeyImageType }) {
  return (
    <div className="relative group inline-block w-full">
      <img
        src={monkeyImage.url}
        alt="Random monkey"
        className="rounded-lg w-full h-auto object-cover"
      />
      <FavoriteToggle key={monkeyImage.url} monkeyImage={monkeyImage} />
    </div>
  );
}