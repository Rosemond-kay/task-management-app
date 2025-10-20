import React, { useState } from "react";

// Utility: merges class names safely
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Root Avatar Component
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ className, src, alt, fallback, ...props }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      data-slot="avatar"
      className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {!imageError && src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          onError={() => setImageError(true)}
          className="aspect-square w-full h-full object-cover"
          data-slot="avatar-image"
        />
      ) : (
        <div
          data-slot="avatar-fallback"
          className="bg-gray-200 flex w-full h-full items-center justify-center rounded-full text-gray-600 font-medium"
        >
          {fallback || alt?.charAt(0).toUpperCase() || "?"}
        </div>
      )}
    </div>
  );
};
