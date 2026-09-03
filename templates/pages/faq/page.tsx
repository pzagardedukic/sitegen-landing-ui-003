import { isSectionEnabled } from "@/core/static";
import FaqPage from "@/page-content/pages/faq/FaqPage";
import { notFound } from "next/navigation";

export default function Faq() {
  if (!isSectionEnabled("faq")) {
    notFound();
  }

  return <FaqPage />;
}
