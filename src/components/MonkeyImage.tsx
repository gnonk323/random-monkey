/* eslint-disable @next/next/no-img-element */
"use client"

import type { MonkeyImageType } from "@/types/unsplash";
import FavoriteToggle from "./FavoriteToggle";
import { motion } from "motion/react"

export function MonkeyImage({ monkeyImage, authenticated }: { monkeyImage: MonkeyImageType, authenticated: boolean }) {
  return (
    <div className="relative group inline-block">
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        key={`image-${monkeyImage.url}`}
        src={monkeyImage.url}
        alt="Random monkey"
        className="rounded-lg max-h-[70vh] h-auto w-auto"
      />
      {authenticated && <FavoriteToggle key={`button-${monkeyImage.url}`} monkeyImage={monkeyImage} />}
    </div>
  );
}

export function GalleryMonkeyImage({ monkeyImage }: { monkeyImage: MonkeyImageType }) {
  return (
    <div className="relative group inline-block w-full">
      <img
        src={monkeyImage.url}
        alt="One of my favorite monkeys"
        className="rounded-lg w-full h-auto object-cover"
      />
      <FavoriteToggle key={monkeyImage.url} monkeyImage={monkeyImage} />
    </div>
  );
}