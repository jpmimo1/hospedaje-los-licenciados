"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { X, ChevronLeft, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Media } from "@/payload-types";
import { motion, AnimatePresence } from "framer-motion";

interface RoomGalleryProps {
  images: { image: number | Media; id?: string | null }[];
  roomName: string;
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get("showGallery") === "true";

  const closeGallery = useCallback(() => {
    router.back();
  }, [router]);

  // Scroll lock and ESC key event listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeGallery();
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, closeGallery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-100 bg-background flex flex-col overflow-y-auto"
        >
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-16 shrink-0 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeGallery}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </Button>

            <h2 className="font-serif font-semibold text-lg truncate max-w-50 sm:max-w-md">
              {roomName}
            </h2>

            <Button
              variant="outline"
              size="icon"
              onClick={closeGallery}
              className="rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </header>

          {/* Vertical Image Feed */}
          <div className="container max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6">
            {images.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="relative w-full aspect-4/3 md:aspect-video rounded-2xl overflow-hidden bg-muted group shadow-sm"
              >
                <Image
                  src={(item.image as Media).url!}
                  alt={`${roomName} - Foto ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority={index < 2}
                />
              </motion.div>
            ))}
          </div>

          {/* Gallery Footer */}
          <div className="py-10 md:py-15 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground font-serif text-lg italic">
              Fin de la galería de {roomName}
            </p>
            <Button variant="link" onClick={closeGallery}>
              Volver a la habitación
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
