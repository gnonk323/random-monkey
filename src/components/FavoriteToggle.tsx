"use client"

import { Star } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import type { MonkeyImageType } from "@/types/unsplash";

export default function FavoriteToggle({ monkeyImage }: { monkeyImage: MonkeyImageType }) {
  const [isFavorite, setIsFavorite] = useState(monkeyImage.favorite);

  const toggleFavorite = async () => {
    try {
      const response = await axios.post("/api/favorites", { image_url: monkeyImage.url });
      if (response.data.success) setIsFavorite(response.data.action === "added");
    } catch (error) {
      console.error("Failed to add/remove favorite", error);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`absolute top-4 right-4 ${!isFavorite && "md:opacity-0 group-hover:opacity-100"} transition-opacity cursor-pointer`}
    >
      <Star size={24} className={`text-yellow-500 ${isFavorite && "fill-current"}`} />
    </button>
  );
}
