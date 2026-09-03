import { isSectionEnabled } from "@/core/static";
import CareersPage from "@/page-content/pages/careers/Careers";
import { notFound } from "next/navigation";

export default function Careers() {
  if (!isSectionEnabled("careers")) {
    notFound();
  }

  return <CareersPage />;
}
