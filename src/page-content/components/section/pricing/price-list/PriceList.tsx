import { getPricingItems, getPricingSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { Box, Typography } from "@mui/material";
import CategorySelector from "../../common/CategorySelector";
import { useMemo, useState } from "react";
import PriceValue from "../common/PriceValue";
import { stripRichText } from "@/core/utils";

export default function PriceList() {
  const { lang } = useLanguage();

  const pricingSection = getPricingSection(lang);
  const pricingItems = getPricingItems(lang);
  const categories = pricingSection?.categories ?? [];

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const selectedCategory =
    selectedIndex === 0 ? undefined : categories[selectedIndex - 1];

  const filteredItems = selectedCategory
    ? pricingItems.filter((item) => item.category.includes(selectedCategory))
    : pricingItems;

  const groupedItems = useMemo(() => {
    return filteredItems.reduce<Record<string, typeof filteredItems>>(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {},
    );
  }, [filteredItems]);  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 6 } }}>
      {/* Filters on the left margin, as on every other list page. */}
      <CategorySelector
        categories={categories}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
      />

      {Object.entries(groupedItems).map(([category, items]) => (
        <Box key={category}>
          <Typography variant="h4" component="h3" color="text.primary" mb={1}>
            {category}
          </Typography>

          {items.map((item, i) => (
            <Box
              key={i}
              sx={(theme) => ({
                py: 2.5,
                borderTop: `1px solid ${theme.palette.surfaces.border}`,
              })}
            >
              {/*
                * On a phone the price goes under the name instead of beside it. Held in one
                * row, a 140 price column plus its struck-through original ate more than half
                * of the 318 available and broke every title over three lines.
                */}
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "flex-start" }}
                gap={{ xs: 1, sm: 3, md: 6 }}
              >
                {/* Left side: title + description */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="p"
                    color="text.primary"
                    sx={{
                      wordBreak: "break-word",
                    }}
                  >
                    {item.title}
                  </Typography>

                  {item.text && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {stripRichText(item.text)}
                    </Typography>
                  )}
                </Box>

                {/* Right side: price wins */}
                <Box
                  sx={{
                    flexShrink: 0,
                    minWidth: { xs: 0, sm: 140 },
                    textAlign: { xs: "left", sm: "right" },
                    whiteSpace: "nowrap",
                  }}
                >
                  <PriceValue
                    value={item.price.value}
                    currency={item.price.currency}
                    unit={item.price.unit}
                    onAgreement={item.price.onAgreement}
                    discountedValue={item.price.discountedValue ?? ""}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
