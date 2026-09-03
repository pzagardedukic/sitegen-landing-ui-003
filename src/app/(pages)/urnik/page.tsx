import { isSectionEnabled } from "@/core/static";
import SchedulePage from "@/page-content/pages/schedule/Schedule";
import { notFound } from "next/navigation";

export default function Schedule() {
  if (!isSectionEnabled("schedule")) {
    notFound();
  }

  return <SchedulePage />;
}
