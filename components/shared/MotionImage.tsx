import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

export function MotionImage(props: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative h-full w-full  ${props.className ?? ""}`}>
      <img
        alt=""
        src={props.blurDataURL}
        style={{ position: "absolute", objectFit: "cover" }}
        className={clsx({
          "left-0 top-0 z-10 h-full w-full transition-all duration-300": true,
          "opacity-0": isLoaded,
          "opacity-1": !isLoaded,
        })}
      />
      <Image
        {...props}
        alt={props.alt ?? ""}
        placeholder={"empty"}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

{
  /* <MotionImage
  src={items.url}
  alt=""
  fill
  priority
  style={{ objectFit: "contain" }}
  blurDataURL={items.dataUrl}
  placeholder="blur"
  sizes="(max-width: 1024px) 100vw, 40vw"
/>; */
}
