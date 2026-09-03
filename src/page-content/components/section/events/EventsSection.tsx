"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Suspense, useMemo } from "react";

import PaginationControls from "@/components/button/PaginationControls";
import { getEventItems, getEventsSection } from "@/core/runtime";
import { getEventSlugById, getPageSlugByKey } from "@/core/static";
import { useListFilters } from "@/core/react";
import { useLanguage } from "@/core/runtime";
import {
  getEventsTranslation,
} from "@/core/translations";
import { formatEventDate, getEventDateTimestamp } from "@/core/utils";
import { stripRichText } from "@/core/utils";
import { normalizeSearchValue, paginate } from "@/core/utils";
import { withBasePath } from "@/core/static";
import DualColumnSection from "../common/DualColumnSection";
import CategorySelector from "../common/CategorySelector";
import EventPreviewCard from "./EventPreviewCard";

const PER_PAGE = 6;

function EventsSectionInner() {
  const router = useRouter();
  const { lang } = useLanguage();

  const eventsSection = getEventsSection(lang);
  const eventItems = getEventItems(lang);
  const eventsTranslation = getEventsTranslation(lang);

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

  const categories = eventsSection?.categories ?? [];

  const filteredAndSortedEvents = useMemo(() => {
    const normalizedSearchQuery = normalizeSearchValue(searchQuery);

    return eventItems
      .filter((event) => {
        if (selectedCategoryId && event.categoryId !== selectedCategoryId) {
          return false;
        }

        if (!normalizedSearchQuery) {
          return true;
        }

        const searchableValue = normalizeSearchValue(
          [
            event.title,
            stripRichText(event.text),
            event.location,
            event.category,
            event.date,
            formatEventDate(event.date, lang),
          ].join(" "),
        );

        return searchableValue.includes(normalizedSearchQuery);
      })
      .sort((firstEvent, secondEvent) => {
        const firstTimestamp = getEventDateTimestamp(firstEvent.date);
        const secondTimestamp = getEventDateTimestamp(secondEvent.date);

        if (firstTimestamp === null && secondTimestamp === null) {
          return firstEvent.id - secondEvent.id;
        }

        if (firstTimestamp === null) {
          return 1;
        }

        if (secondTimestamp === null) {
          return -1;
        }

        const dateDifference = firstTimestamp - secondTimestamp;

        if (dateDifference === 0) {
          return firstEvent.id - secondEvent.id;
        }

        return sortOrder === "ascending" ? dateDifference : -dateDifference;
      });
  }, [eventItems, searchQuery, selectedCategoryId, sortOrder, lang]);

  const { pageCount, currentPage, pageItems } = paginate(
    filteredAndSortedEvents,
    page,
    PER_PAGE,
  );

  if (!eventsSection) {
    return null;
  }

  const handleEventClick = (id: number) => {
    router.push(`/${getPageSlugByKey("events")}/${getEventSlugById(id)}`);
  };

  return (
    <DualColumnSection
      title={eventsTranslation.title}
      description={eventsSection.text}
      columns="600fr 80fr 520fr"
    >
      <Box width="100%" mt={4}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            size="small"
            type="search"
            label={eventsTranslation.search}
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
            sx={{ flex: 1 }}
          />

          <TextField
            select
            fullWidth
            size="small"
            label={eventsTranslation.sortByDate}
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as "ascending" | "descending")
            }
            sx={{ width: { xs: "100%", md: 260 }, flexShrink: 0 }}
          >
            <MenuItem value="ascending">
              {eventsTranslation.dateAscending}
            </MenuItem>
            <MenuItem value="descending">
              {eventsTranslation.dateDescending}
            </MenuItem>
          </TextField>
        </Box>

        <Box sx={{ mt: 3 }}>
          <CategorySelector
            categories={categories.map((category) => category.name)}
            selectedIndex={
              selectedCategoryId
                ? categories.findIndex((c) => c.id === selectedCategoryId) + 1
                : 0
            }
            onSelectIndex={(index) =>
              setSelectedCategoryId(index === 0 ? "" : categories[index - 1].id)
            }
          />
        </Box>

        <Box sx={{ height: { xs: 32, md: 48 } }} />

        <Box mb={6} mt={3}>
          {pageItems.length > 0 ? (
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 4,
              }}
            >
              {pageItems.map((event) => (
                <Box
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  sx={{ cursor: "pointer", height: "100%" }}
                >
                  <EventPreviewCard
                    image={event.image}
                    title={event.title}
                    text={event.text}
                    date={event.date}
                    location={event.location}
                    category={event.category}
                    isCancelled={event.isCancelled}
                    cancelledLabel={eventsTranslation.cancelled}
                    todayLabel={eventsTranslation.today}
                    tomorrowLabel={eventsTranslation.tomorrow}
                    lang={lang}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" textAlign="center" py={8}>
              {eventsTranslation.noResults}
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
    </DualColumnSection>
  );
}

export default function EventsSection() {
  return (
    <Suspense fallback={null}>
      <EventsSectionInner />
    </Suspense>
  );
}
