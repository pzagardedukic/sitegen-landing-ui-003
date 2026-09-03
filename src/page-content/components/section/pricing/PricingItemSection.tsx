"use client";

import { getPricingItems, getPricingSection } from "@/core/runtime";
import { Box, Divider, Typography } from "@mui/material";
import BackButton from "@/components/button/BackButton";
import SectionDescription from "../common/SectionDescription";
import { CustomGallery } from "../common/CustomGallery";
import { useLanguage } from "@/core/runtime";
import RelatedItems from "./store/RelatedItems";
import { FALLBACK_IMAGE } from "@/core/static";
import PriceValue from "./common/PriceValue";
import DiscountBadge from "./common/DiscountBadge";
import StatusBadge from "./common/StatusBadge";
import { getPageSlugByKey } from "@/core/static";
import { getPricingTranslation_priceListWithImages } from "@/core/translations";
import ShareActions from "../common/ShareActions";
import { useBackToList } from "@/core/react";

/*
 * Price item detail. Pictures on the left at 440 with the thumbnail strip under them, the
 * text on the right: badges, description, the feature pairs, then the price on its own rule
 * — the one number a reader came for, so it sits last and alone rather than inside the text.
 */
export default function PricingItemSection({ id }: { id: number }) {
  const { lang } = useLanguage();
  const pricingSection = getPricingSection(lang);

  /*
   * Ahead of the guards below: a hook that runs only on some renders is the rules-of-hooks
   * break reported as ui-001#1.
   */
  const handleBackToPricing = useBackToList(`/${getPageSlugByKey("pricing")}`);

  if (!pricingSection) {
    return null;
  }

  // NOTE Currently, only one type of pricing section has more info.
  if (pricingSection.type !== "PRICING_STORE") {
    return null;
  }

  const pricingItem = getPricingItems(lang).find((item) => item.id === id);

  if (!pricingItem) {
    return null;
  }

  const pricingItemTranslation =
    getPricingTranslation_priceListWithImages(lang).items;

  const relatedItemIds = getPricingItems(lang)
    .filter(
      (item) =>
        item.id !== pricingItem.id && item.category === pricingItem.category,
    )
    .map((item) => item.id);

  return (
    <Box display="flex" flexDirection="column" gap={5} flex={1}>
      <BackButton
        label={pricingItemTranslation.goBackButton}
        onClick={handleBackToPricing}
      />

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={{ xs: 4, md: 7 }}
        alignItems="flex-start"
        flex={1}
      >
        <Box
          width={{ xs: "100%", md: "440px" }}
          flexShrink={0}
          flexDirection="column"
          display="flex"
          gap={2}
        >
          <Box
            component="img"
            src={pricingItem.images[0] || FALLBACK_IMAGE}
            alt={pricingItem.title}
            loading="lazy"
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: "25px",
              objectFit: "cover",
            }}
          />

          <CustomGallery
            items={pricingItem.images}
            variant="strip"
            thumbSize={140}
          />
        </Box>

        <Box flex={1} minWidth={0} gap={3} display="flex" flexDirection="column">
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={2}
          >
            <Typography
              variant="h4"
              component="h2"
              color="text.primary"
              sx={{ flex: 1, minWidth: 0 }}
            >
              {pricingItemTranslation.description}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <StatusBadge status={pricingItem.status} />

              <DiscountBadge
                price={pricingItem.price.value}
                discountedValue={pricingItem.price.discountedValue}
              />
            </Box>
          </Box>

          <SectionDescription description={pricingItem.text} textAlign="left" />

          {pricingItem.features.length > 0 && (
            <Box display="flex" flexDirection="column">
              {pricingItem.features.map((feature, index) => (
                <Box
                  key={index}
                  sx={(theme) => ({
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0.25, sm: 2 },
                    py: 1.5,
                    borderTop:
                      index === 0
                        ? "none"
                        : `1px solid ${theme.palette.surfaces.border}`,
                  })}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ width: { xs: "auto", sm: 180 }, flexShrink: 0 }}
                  >
                    {feature.label}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {feature.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Divider />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "baseline" }}
            flexDirection={{ xs: "column", sm: "row" }}
            gap={{ xs: 1, sm: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {pricingItemTranslation.price}
            </Typography>

            <PriceValue
              value={pricingItem.price.value}
              currency={pricingItem.price.currency}
              unit={pricingItem.price.unit}
              onAgreement={pricingItem.price.onAgreement}
              discountedValue={pricingItem.price.discountedValue}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          mb: 4,
        }}
      >
        <ShareActions title={pricingItem.title} />
      </Box>

      {relatedItemIds.length > 0 && (
        <Box display="flex" flexDirection="column" gap={6} mb={4}>
          <RelatedItems itemIds={relatedItemIds} />
        </Box>
      )}
    </Box>
  );
}
