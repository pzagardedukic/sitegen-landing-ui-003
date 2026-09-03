"use client";

import FilterChips from "@/components/common/FilterChips";
import { useLanguage } from "@/core/runtime";
import { getButtonTranslation } from "@/core/translations";

type CategorySelectorProps = {
  categories: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
};

/* The filter row from the design system: pills, the active one carrying the brand gradient. */
export default function CategorySelector({
  categories,
  selectedIndex,
  onSelectIndex,
}: CategorySelectorProps) {
  const { lang } = useLanguage();
  const allLabel = getButtonTranslation(lang).all;
  const options = [allLabel, ...categories];

  return (
    <FilterChips
      options={options.map((label, index) => ({ value: String(index), label }))}
      value={String(selectedIndex)}
      onChange={(value) => onSelectIndex(Number(value))}
      ariaLabel={allLabel}
    />
  );
}
