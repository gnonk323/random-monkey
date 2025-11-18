import { NextResponse } from "next/server";
import axios from "axios";
import type { UnsplashPhoto } from "@/types/types";
import { createClient } from "@/lib/supabase/server";

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

console.log("MONKEY IMAGE CACHE TTL: ", CACHE_TTL);

let cachedMonkeys: { id: string; url: string }[] = [];
let lastFetchTime = 0;

async function getRandomMonkey(): Promise<{ id: string; url: string }> {
  const now = Date.now();

  if (cachedMonkeys.length === 0 || now - lastFetchTime > CACHE_TTL) {
    console.log("[API][INFO] Cache empty or expired. Fetching new images from Unsplash...");
    try {
      const res = await axios.get<UnsplashPhoto[]>(`https://api.unsplash.com/photos/random`, {
        params: { query: "monkey", count: 30 },
        headers: { "Accept-Version": "v1", Authorization: `Client-ID ${UNSPLASH_KEY}` },
      });

      cachedMonkeys = res.data.map((img) => ({
        id: img.id,
        url: img.urls.regular,
      }));
      lastFetchTime = now;

      console.log(`[API][INFO] Fetched ${cachedMonkeys.length} new monkey images from Unsplash.`);
    } catch (err) {
      console.error("[API][INFO] Failed to fetch from Unsplash:", err);
      throw new Error(`Failed to fetch images from Unsplash: ${err}`);
    }
  } else {
    console.log("[API][INFO] Using cached monkey images.");
  }

  const random = cachedMonkeys[Math.floor(Math.random() * cachedMonkeys.length)];
  console.log(`[API][INFO] Returning one random monkey:\n${JSON.stringify(random, null, 2)}`);
  return random;
}

export async function GET() {
  try {
    const { id, url } = await getRandomMonkey();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isFavorite = false;
    if (user) {
      const { data: favorites } = await supabase
        .from("favorites")
        .select("image_url")
        .eq("user_id", user.id)
        .eq("image_id", id);

      isFavorite = !!(favorites && favorites.length > 0);
    }

    return NextResponse.json({ user, id, url, favorite: isFavorite });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
