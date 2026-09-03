import { isSectionEnabled } from "@/core/static";
import ServicesPage from "@/page-content/pages/services/Services";
import { notFound } from "next/navigation";

export default function Services() {
  if (!isSectionEnabled("services")) {
    notFound();
  }

  return <ServicesPage />;
}
