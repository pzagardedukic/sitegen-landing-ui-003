"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import FilterChips from "@/components/common/FilterChips";
import { useRouter } from "next/navigation";
import { Suspense, useMemo } from "react";

import PaginationControls from "@/components/button/PaginationControls";
import { getPricingItems, getPricingSection } from "@/core/runtime";
import { getPageSlugByKey, getPricingSlugById } from "@/core/static";
import { useListFilters } from "@/core/react";
import { useLanguage } from "@/core/runtime";
import {
  getButtonTranslation,
  getPriceTranslation,
  getPricingStoreTranslation,
} from "@/core/translations";
import { stripRichText } from "@/core/utils";
import { normalizeSearchValue, paginate } from "@/core/utils";
import StoreItemCard from "./StoreItemCard";

type StorePrice = {
  value: string;
  discountedValue: string;
  onAgreement: boolean;
};

const PER_PAGE = 9;

/* Inputs carry the same pill radius as the filter chips and the buttons beside them. */
const roundedFieldStyle = {
  "& .MuiOutlinedInput-root": { borderRadius: 999 },
};

const parsePriceValue = (value: string): number | null => {
  let normalizedValue = value.trim().replace(/\s+/g, "");

  if (!normalizedValue) {
    return null;
  }

  normalizedValue = normalizedValue.replace(/[^\d,.-]/g, "");

  const lastCommaIndex = normalizedValue.lastIndexOf(",");
  const lastDotIndex = normalizedValue.lastIndexOf(".");

  if (lastCommaIndex >= 0 && lastDotIndex >= 0) {
    normalizedValue =
      lastCommaIndex > lastDotIndex
        ? normalizedValue.replace(/\./g, "").replace(",", ".")
        : normalizedValue.replace(/,/g, "");
  } else if (lastCommaIndex >= 0) {
    const decimalPlaces = normalizedValue.length - lastCommaIndex - 1;

    normalizedValue =
      decimalPlaces > 0 && decimalPlaces <= 2
        ? normalizedValue.replace(",", ".")
        : normalizedValue.replace(/,/g, "");
  } else if (lastDotIndex >= 0) {
    const dotCount = (normalizedValue.match(/\./g) ?? []).length;
    const decimalPlaces = normalizedValue.length - lastDotIndex - 1;

    if (dotCount > 1 || decimalPlaces === 3) {
      normalizedValue = normalizedValue.replace(/\./g, "");
    }
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const getComparablePrice = (price: StorePrice): number | null => {
  if (price.onAgreement) {
    return null;
  }

  return parsePriceValue(price.discountedValue) ?? parsePriceValue(price.value);
};

function CustomStoreInner() {
  const router = useRouter();
  const { lang } = useLanguage();

  const pricingSection = getPricingSection(lang);
  const pricingItems = getPricingItems(lang);
  const categories = pricingSection?.categoryOptions ?? [];
  const pricingStoreTranslation = getPricingStoreTranslation(lang);
  const buttonTranslation = getButtonTranslation(lang);
  const priceTranslation = getPriceTranslation(lang);

  const {
    searchInput,
    setSearchInput,
    searchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    sortOrder,
    setSortOrder,
    page,
    setPage,
  } = useListFilters();

  const filteredAndSortedItems = useMemo(() => {
    const normalizedSearchQuery = normalizeSearchValue(searchQuery);

    return pricingItems
      .filter((item) => {
        if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
          return false;
        }

        if (!normalizedSearchQuery) {
          return true;
        }

        const searchableValue = normalizeSearchValue(
          [
            item.title,
            stripRichText(item.text),
            item.category,
            item.price.value,
            item.price.discountedValue,
            item.price.currency,
            item.price.onAgreement ? priceTranslation.onAgreement : "",
            ...item.features.flatMap((feature) => [
              feature.label,
              feature.value,
            ]),
          ].join(" "),
        );

        return searchableValue.includes(normalizedSearchQuery);
      })
      .sort((firstItem, secondItem) => {
        const firstPrice = getComparablePrice(firstItem.price);
        const secondPrice = getComparablePrice(secondItem.price);

        if (firstPrice === null && secondPrice === null) {
          return firstItem.id - secondItem.id;
        }

        if (firstPrice === null) {
          return 1;
        }

        if (secondPrice === null) {
          return -1;
        }

        const priceDifference = firstPrice - secondPrice;

        if (priceDifference === 0) {
          return firstItem.id - secondItem.id;
        }

        return sortOrder === "ascending" ? priceDifference : -priceDifference;
      });
  }, [
    pricingItems,
    searchQuery,
    selectedCategoryId,
    sortOrder,
    priceTranslation,
  ]);

  const { pageCount, currentPage, pageItems } = paginate(
    filteredAndSortedItems,
    page,
    PER_PAGE,
  );

  const handleItemClick = (id: number) => {
    router.push(`/${getPageSlugByKey("pricing")}/${getPricingSlugById(id)}`);
  };

  return (
    <Box
      component="section"
      sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 6 } }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          type="search"
          placeholder={pricingStoreTranslation.search}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: 1, minWidth: 0, ...roundedFieldStyle }}
        />

        <TextField
          select
          fullWidth
          size="small"
          label={pricingStoreTranslation.sortByPrice}
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value as "ascending" | "descending")
          }
          sx={{
            width: { xs: "100%", md: 260 },
            flexShrink: 0,
            ...roundedFieldStyle,
          }}
        >
          <MenuItem value="ascending">
            {pricingStoreTranslation.priceAscending}
          </MenuItem>
          <MenuItem value="descending">
            {pricingStoreTranslation.priceDescending}
          </MenuItem>
        </TextField>
      </Box>

      {/* Categories are pills like every other list page, not a third dropdown. */}
      {categories.length > 0 && (
        <FilterChips
          ariaLabel={pricingStoreTranslation.category}
          options={[
            { value: "", label: buttonTranslation.all },
            ...categories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          ]}
          value={selectedCategoryId}
          onChange={setSelectedCategoryId}
        />
      )}

      <Box mb={2}>
        {pageItems.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gap: "40px",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {pageItems.map((item) => (
              <Box key={item.id} onClick={() => handleItemClick(item.id)}>
                <StoreItemCard
                  image={item.images[0] ?? ""}
                  title={item.title}
                  description={item.text}
                  price={item.price.value}
                  unit={item.price.unit}
                  currency={item.price.currency}
                  onAgreement={item.price.onAgreement}
                  discountedValue={item.price.discountedValue}
                  status={item.status}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" py={8}>
            {pricingStoreTranslation.noResults}
          </Typography>
        )}
      </Box>

      {pageCount > 1 && (
        <PaginationControls
          page={currentPage}
          pageCount={pageCount}
          onChange={setPage}
        />
      )}
    </Box>
  );
}

export default function CustomStore() {
  return (
    <Suspense fallback={null}>
      <CustomStoreInner />
    </Suspense>
  );
}
