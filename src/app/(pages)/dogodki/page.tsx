import { isSectionEnabled } from "@/core/static";
import EventsPage from "@/page-content/pages/events/Events";
import { notFound } from "next/navigation";

export default function Events() {
  if (!isSectionEnabled("events")) {
    notFound();
  }

  return <EventsPage />;
}
