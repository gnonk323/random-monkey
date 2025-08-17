import { NextResponse } from "next/server";
import axios from "axios";
import type { UnsplashPhoto } from "@/types/unsplash";

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

let cachedMonkeys: string[] = [];
let lastFetchTime = 0;

async function getRandomMonkey(): Promise<string> {
  const now = Date.now();

  if (cachedMonkeys.length === 0 || now - lastFetchTime > CACHE_TTL) {
    console.log("[Monkey API] Cache empty or expired. Fetching new images from Unsplash...");
    try {
      const res = await axios.get<UnsplashPhoto[]>(
        `https://api.unsplash.com/photos/random`,
        {
          params: { query: "monkey", count: 50 },
          headers: { "Accept-Version": "v1", Authorization: `Client-ID ${UNSPLASH_KEY}` },
        }
      );

      cachedMonkeys = res.data.map((img) => img.urls.regular);
      lastFetchTime = now;

      console.log(`[Monkey API] Fetched ${cachedMonkeys.length} new monkey images from Unsplash.`);
    } catch (err) {
      console.error("[Monkey API] Failed to fetch from Unsplash:", err);
      throw new Error(`Failed to fetch images from Unsplash: ${err}`);
    }
  } else {
    console.log("[Monkey API] Using cached monkey images.");
  }

  const random = cachedMonkeys[Math.floor(Math.random() * cachedMonkeys.length)];
  console.log(`[Monkey API] Returning one random monkey: ${random}`);
  return random;
}

export async function GET() {
  try {
    const url = await getRandomMonkey();
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
