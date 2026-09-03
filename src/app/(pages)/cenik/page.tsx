import { isSectionEnabled } from "@/core/static";
import PricingPage from "@/page-content/pages/pricing/Pricing";
import { notFound } from "next/navigation";

export default function Pricing() {
  if (!isSectionEnabled("pricing")) {
    notFound();
  }

  return <PricingPage />;
}
