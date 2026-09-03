import { isSectionEnabled } from "@/core/static";
import VideosPage from "@/page-content/pages/videos/Videos";
import { notFound } from "next/navigation";

export default function Videos() {
  if (!isSectionEnabled("videos")) {
    notFound();
  }

  return <VideosPage />;
}
