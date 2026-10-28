export type MediaType = "image" | "video" | "audio" | "document";

/** One hosted file from `GET /gallery`: an upload or something an agent made. */
export type GalleryItem = {
  id: string;
  type: MediaType;
  url: string;
  name: string;
  createdAt: string;
};
