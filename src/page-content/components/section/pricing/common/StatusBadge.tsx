"use client";

import Tag from "@/components/common/Tag";
import { PricingItemStatus } from "@/core/types";
import { useLanguage } from "@/core/runtime";
import { getPriceTranslation } from "@/core/translations";

type StatusBadgeProps = {
  status?: PricingItemStatus;
};

/*
 * Only the states worth flagging get a badge. AVAILABLE is the normal case — labelling every
 * card with it says nothing and crowds out the "recommended" mark next to it.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  const { lang } = useLanguage();
  const t = getPriceTranslation(lang);

  if (status === "COMING_SOON") {
    return <Tag label={t.comingSoon} tone="neutral" />;
  }

  if (status === "UNAVAILABLE") {
    return <Tag label={t.unavailable} tone="outline" />;
  }

  return null;
}
