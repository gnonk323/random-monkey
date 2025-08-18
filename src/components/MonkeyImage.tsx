/* eslint-disable @next/next/no-img-element */
"use client"

import type { MonkeyImageType } from "@/types/types";
import FavoriteToggle from "./FavoriteToggle";
import { motion } from "motion/react"

export function MonkeyImage({ monkeyImage, authenticated }: { monkeyImage: MonkeyImageType, authenticated: boolean }) {
  return (
    <div className="relative group">
      <motion.img
        key={`image-${monkeyImage.url}`}
        src={monkeyImage.url}
        alt="Random monkey"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="max-h-[70vh] max-w-full rounded-lg object-contain"
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