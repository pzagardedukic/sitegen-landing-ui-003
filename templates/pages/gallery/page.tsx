import { isSectionEnabled } from "@/core/static";
import GalleryPage from "@/page-content/pages/gallery/Gallery";
import { notFound } from "next/navigation";

export default function Gallery() {
  if (!isSectionEnabled("gallery")) {
    notFound();
  }

  return <GalleryPage />;
}
