"use client"

import Image from "next/image";
import { Shuffle, Album } from "lucide-react";
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
      <main className="flex flex-col gap-6 items-center justify-center h-screen px-4 py-16">
        <div className="h-full flex flex-col items-center justify-center gap-4">
          {monkeyImageUrl ? (
            <img
              src={monkeyImageUrl}
              alt="Random monkey"
              className="rounded-lg max-h-2/3"
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
          {monkeyError && (
            <div className="px-2 py-1 rounded-lg outline-2 outline-red-500 bg-red-500/30 text-red-500">
              {monkeyError}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <p className="font-semibold text-sm">Gustave Montana</p>
            <a className="flex gap-2 items-center group" href="https://github.com/gnonk323" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
              <p className="text-sm group-hover:underline">GitHub</p>
            </a>
            <div className="flex gap-2 items-center group">
              <Album size={16} />
              <a href="https://gustave-montana.vercel.app/" className="text-sm group-hover:underline">Portfolio</a>
            </div>
          </div>
          <p className="text-neutral-500 text-sm">Images courtesy of <a className="underline" href="https://unsplash.com/" target="_blank">Unsplash.com</a></p>
        </div>
      </main>
    </div>
  );
}
