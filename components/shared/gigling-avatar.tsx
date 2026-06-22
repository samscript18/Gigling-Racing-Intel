"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

type GiglingAvatarProps = {
  className?: string;
  imageUrl: string;
  name: string;
  priority?: boolean;
};

export function GiglingAvatar({
  className,
  imageUrl,
  name,
  priority = false
}: GiglingAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-white/12 bg-track-radial",
        className
      )}
    >
      <div className="absolute inset-0 bg-racing-grid opacity-45" />
      <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-white/88">
        {name.slice(0, 2).toUpperCase()}
      </span>
      {imageUrl && !imageFailed ? (
        // The live API can return artwork from changing CDN hosts, so the browser loads it directly.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${name} Gigling`}
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          src={imageUrl}
          onError={() => setImageFailed(true)}
        />
      ) : null}
      <div className="absolute inset-x-3 bottom-3 h-px bg-gradient-to-r from-transparent via-cyan-racing/65 to-transparent" />
    </div>
  );
}
