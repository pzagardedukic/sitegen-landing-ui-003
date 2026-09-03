"use client";

import { Box } from "@mui/material";
import { useState } from "react";

import { getScheduleSection, getScheduleTables } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import CategorySelector from "../common/CategorySelector";
import DualColumnSection from "../common/DualColumnSection";
import ScheduleTableView from "./ScheduleTableView";

/* Figma frame 1440x1494: the 600/80/520 intro, the category chips, then the tables. */
export default function ScheduleSection() {
  const { lang } = useLanguage();
  const scheduleSection = getScheduleSection(lang);
  const scheduleTables = getScheduleTables(lang);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!scheduleSection) {
    return null;
  }

  const categoryLabels = scheduleSection.categories.map(
    (category) => category.name,
  );
  const selectedCategoryId =
    selectedIndex === 0
      ? undefined
      : scheduleSection.categories[selectedIndex - 1]?.id;
  const filteredTables = selectedCategoryId
    ? scheduleTables.filter(
        (scheduleTable) => scheduleTable.categoryId === selectedCategoryId,
      )
    : scheduleTables;

  return (
    <DualColumnSection
      title={scheduleSection.title}
      description={scheduleSection.text}
      columns="600fr 80fr 520fr"
    >
      {categoryLabels.length > 0 && (
        <CategorySelector
          categories={categoryLabels}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
        />
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 7 } }}>
        {filteredTables.map((scheduleTable, index) => (
          <ScheduleTableView
            key={index}
            title={scheduleTable.title}
            text={scheduleTable.text}
            rows={scheduleTable.rows}
          />
        ))}
      </Box>
    </DualColumnSection>
  );
}
