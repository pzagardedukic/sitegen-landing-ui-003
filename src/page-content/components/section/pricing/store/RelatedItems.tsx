"use client";

import { getPricingItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { Box, Typography } from "@mui/material";
import HoverZoomImage from "@/components/image/HoverZoomImage";
import { useRouter } from "next/navigation";
import { getPageSlugByKey, getPricingSlugById } from "@/core/static";
import { getPricingTranslation_priceListWithImages } from "@/core/translations";
import SectionTitle from "../../common/SectionTitle";
import { FALLBACK_IMAGE } from "@/core/static";

/*
 * Items from the same category under the detail. Four across on desktop and two on mobile,
 * each with its title: ui-001 showed bare thumbnails, and a picture with no name is not a
 * link a reader can decide to follow.
 */
export default function RelatedItems({ itemIds }: { itemIds: number[] }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = getPricingTranslation_priceListWithImages(lang);

  const relatedItems = getPricingItems(lang)
    .filter((item) => itemIds.includes(item.id))
    .slice(0, 4);

  const handleItemClick = (id: number) => {
    router.push(`/${getPageSlugByKey("pricing")}/${getPricingSlugById(id)}`);
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <SectionTitle title={t.relatedItemsTitle} justify="flex-start" />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 2, md: 3 },
        }}
      >
        {relatedItems.map((item) => (
          <Box
            key={item.id}
            className="zoom-image-parent"
            onClick={() => handleItemClick(item.id)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              minWidth: 0,
              cursor: "pointer",
            }}
          >
            <HoverZoomImage
              src={item.images[0] || FALLBACK_IMAGE}
              width="100%"
              sx={{
                borderRadius: "25px",
                width: "100%",
                height: { xs: 160, sm: 200, md: 220 },
              }}
            />

            <Typography variant="h6" color="text.primary">
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
