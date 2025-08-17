"use client"

import Image from "next/image";
import { Shuffle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [loadingMonkey, setLoadingMonkey] = useState(false);
  const [monkeyImageUrl, setMonkeyImageUrl] = useState<string>();
  const [monkeyError, setMonkeyError] = useState<string | null>(null);

  async function fetchMonkey() {
    setLoadingMonkey(true)
    setMonkeyError(null)
    try {
      const response = await axios.get("/api/monkey");
      if (response.data.url) {
        setMonkeyImageUrl(response.data.url)
      } else {
        console.error("Unexpected error fetching monkey :(", response.data.error);
        setMonkeyError("There was a problem getting a new monkey :(")
      }
    } catch (error) {
      console.error(error);
      setMonkeyError("There was a problem getting a new monkey :(")
    } finally {
      setLoadingMonkey(false);
    }
  }

  useEffect(() => {
    fetchMonkey()
  }, []);

  return (
    <div className="font-sans">
      <main className="flex flex-col gap-6 items-center justify-center h-screen p-4">
        {monkeyImageUrl ? (
          <img
            src={monkeyImageUrl}
            alt="Random monkey"
            className="rounded-lg md:max-h-2/3 max-h-1/3"
          />
        ) : (
          <div className="p-20 rounded-lg outline outline-dashed">
            No monkey here...
          </div>
        )}
        <button
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition-all hover:-translate-y-1 font-extrabold cursor-pointer"
          disabled={loadingMonkey}
          onClick={fetchMonkey}
        >
          <Shuffle />
          {loadingMonkey ? "Loading..." : "New Monkey!"}
        </button>
        <p className="text-neutral-500">Images courtesy of <a className="underline" href="https://unsplash.com/">Unsplash.com</a></p>
        {monkeyError && (
          <div className="p-2 rounded-lg outline-2 outline-red-500 bg-red-500/30 text-red-500">
            {monkeyError}
          </div>
        )}
      </main>
    </div>
  );
}
