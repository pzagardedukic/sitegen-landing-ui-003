"use client";

import { getPricingSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import CustomStore from "./store/CustomStore";
import PriceList from "./price-list/PriceList";
import SubscriptionSection from "./subscription/SubscriptionSection";
import DualColumnSection from "../common/DualColumnSection";
import { Box, Typography } from "@mui/material";

/*
 * Figma frame 1440x1251: the 560/80/560 intro with the note under the description, then the
 * layout the site's pricing type asks for.
 */
export default function PricingSection() {
  const { lang } = useLanguage();
  const pricingSection = getPricingSection(lang);

  if (!pricingSection) {
    return null;
  }

  const renderContent = () => {
    switch (pricingSection.type) {
      case "PRICING_STORE":
        return <CustomStore />;
      case "PRICING_LIST":
        return <PriceList />;
      case "PRICING_PACKAGES":
        return <SubscriptionSection />;
      default:
        return null;
    }
  };

  return (
    <DualColumnSection
      title={pricingSection.sectionName}
      description={pricingSection.text}
      columns="560fr 80fr 560fr"
    >
      {renderContent()}

      {pricingSection.note && (
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          {pricingSection.note}
        </Typography>
      )}
    </DualColumnSection>
  );
}
