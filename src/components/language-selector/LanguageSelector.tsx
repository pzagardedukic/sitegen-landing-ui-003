import React, { useState } from "react";
import { Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HoverDropdown, { DropdownItem } from "../common/HoverDropdown";

export type LanguageOption = {
  code: string;
  label: string;
};

type LanguageSelectorProps = {
  supportedLanguages: LanguageOption[];
  defaultLanguage?: string;
  onChange: (selected: string) => void;
};

export default function LanguageSelector({
  supportedLanguages,
  defaultLanguage,
  onChange,
}: LanguageSelectorProps) {
  const [selectedLang, setSelectedLang] = useState(
    defaultLanguage || supportedLanguages[0]?.code,
  );

  const handleSelect = (code: string) => {
    setSelectedLang(code);
    onChange(code);
  };

  const dropdownItems: DropdownItem[] = supportedLanguages.map((lang) => ({
    label: lang.label,
    onClick: () => handleSelect(lang.code),
  }));

  return (
    <HoverDropdown
      trigger={
        <Button
          color="inherit"
          endIcon={<ArrowDropDownIcon />}
          sx={(theme) => ({
            ...theme.typography.body1,
            color: theme.palette.header.text,
            "&:hover": {
              color: theme.palette.header.hoverText,
              backgroundColor: "transparent",
            },
          })}
        >
          {selectedLang}
        </Button>
      }
      items={dropdownItems}
    />
  );
}
