"use client";

import { useMemo } from "react";
import { Box } from "@mui/material";
import SubscriptionCard, { SubscriptionPlan } from "./SubscriptionCard";
import { getPricingItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { useRouter } from "next/navigation";
import { getPageSlugByKey } from "@/core/static";
import { getPricingTranslation_packagesNoImages } from "@/core/translations";

export default function SubscriptionSection() {
  const { lang } = useLanguage();
  const router = useRouter();
  const t = getPricingTranslation_packagesNoImages(lang);

  const pricingItems = getPricingItems(lang);
  const plans: SubscriptionPlan[] = useMemo(() => {
    return pricingItems.map((item) => ({
      id: String(item.id),
      name: item.title,
      subtitle: item.text || "",
      price: item.price.value,
      currency: item.price.currency,
      unit: item.price.unit,
      onAgreement: item.price.onAgreement,
      discountedValue: item.price.discountedValue ?? "",
      category: item.category,
      status: item.status,
      // Keep both halves: the card shows the label on the left and the value on the right.
      features: item.features.map((feature) => ({
        label: feature.label,
        value: feature.value,
      })),
      highlight: item.recommended,
    }));
  }, [pricingItems]);

  const handleSelect = (title: string) => {
    router.push(
      `/${getPageSlugByKey("contact")}?subject=${encodeURIComponent(
        t.acquirementSubject,
      )}: ${encodeURIComponent(title)}`,
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gap: "40px",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          alignItems: "stretch",
        }}
      >
        {plans.map((plan) => (
          <Box key={plan.id}>
            <SubscriptionCard plan={plan} onSelect={handleSelect} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
