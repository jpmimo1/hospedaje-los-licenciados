"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { X, ChevronLeft, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Media } from "@/payload-types";
import { motion } from "framer-motion";
import { Dialog } from "radix-ui";
import { closeRoomGallery, roomGalleryOpener } from "@/lib/room-gallery-history";

interface RoomGalleryProps {
  images: { image: number | Media; id?: string | null }[] | null | undefined;
  roomName: string;
  locale: Locales;
}

const dictionary = {
  es: {
    back: "Volver",
    close: "Cerrar galería",
    title: "Galería de fotos de",
    photo: "Foto",
    end: "Fin de la galería de",
    backToRoom: "Volver a la habitación",
  },
  en: {
    back: "Back",
    close: "Close gallery",
    title: "Photo gallery for",
    photo: "Photo",
    end: "End of the gallery for",
    backToRoom: "Back to the room",
  },
};

export function RoomGallery({ images, roomName, locale }: RoomGalleryProps) {
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("showGallery") === "true";
  const closing = useRef(false);
  const t = dictionary[locale] || dictionary.es;

  useEffect(() => {
    if (!isOpen) closing.current = false;
  }, [isOpen]);

  const closeGallery = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    closeRoomGallery();
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) closeGallery(); }}>
      <Dialog.Portal>
        {/* Radix locks background scroll while allowing native pinch zoom. */}
        <Dialog.Overlay className="fixed inset-0 z-100 bg-background" />
        <Dialog.Content
          asChild
          aria-modal="true"
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const trigger = roomGalleryOpener() ??
              document.querySelector<HTMLElement>("[data-room-gallery-trigger]");
            trigger?.focus({ preventScroll: true });
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-100 bg-background flex flex-col"
          >
            <header className="z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-16 shrink-0 flex items-center justify-between gap-3">
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm" aria-label={t.backToRoom} className="gap-2 text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t.back}</span>
                </Button>
              </Dialog.Close>

              <Dialog.Title asChild>
                <h2 className="font-serif font-semibold text-lg truncate min-w-0">
                  <span className="sr-only">{t.title} </span>{roomName}
                </h2>
              </Dialog.Title>

              <Dialog.Close asChild>
                <Button variant="outline" size="icon" aria-label={t.close} className="rounded-full">
                  <X className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Dialog.Close>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <div className="container max-w-6xl mx-auto py-8 px-4 flex flex-col gap-6">
                {images?.map((item, index) => {
                  const media = typeof item.image === "object" ? item.image : null;
                  if (!media?.url) return null;

                  return (
                    <motion.div
                      key={item.id || media.id + "-" + index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full flex items-center justify-center rounded-2xl bg-muted p-2 md:p-4 shadow-sm"
                    >
                      <Image
                        src={media.url}
                        alt={media.alt || roomName + " - " + t.photo + " " + (index + 1)}
                        width={media.width || 1200}
                        height={media.height || 800}
                        className="w-auto h-auto max-w-full max-h-[75dvh] object-contain rounded-xl"
                        sizes="(max-width: 768px) 100vw, 1152px"
                        priority={index < 2}
                      />
                    </motion.div>
                  );
                })}
              </div>

              <div className="py-10 md:py-15 text-center flex flex-col items-center gap-4 px-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <p className="text-muted-foreground font-serif text-lg italic">
                  {t.end} {roomName}
                </p>
                <Dialog.Close asChild>
                  <Button variant="ghost" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
                    {t.backToRoom}
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
