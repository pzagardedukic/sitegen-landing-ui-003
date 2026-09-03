import { isSectionEnabled } from "@/core/static";
import PortfolioPage from "@/page-content/pages/portfolio/Portfolio";
import { notFound } from "next/navigation";

export default function Portfolio() {
  if (!isSectionEnabled("portfolio")) {
    notFound();
  }

  return <PortfolioPage />;
}
