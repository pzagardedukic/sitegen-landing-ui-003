import { isSectionEnabled } from "@/core/static";
import BlogPage from "@/page-content/pages/blog/Blog";
import { notFound } from "next/navigation";

export default function Blog() {
  if (!isSectionEnabled("blog")) {
    notFound();
  }
  
  return <BlogPage />;
}
