import { Box } from "@mui/material";

import type { Career } from "@/core/runtime";
import {
  getCareerSlugById,
  getPageSlugByKey,
} from "@/core/static";
import { useLanguage } from "@/core/runtime";
import {
  getButtonTranslation,
  getCareersTranslation,
} from "@/core/translations";
import { withBasePath } from "@/core/static";
import CareerPreviewCard from "./CareerPreviewCard";

type CareersListProps = {
  careers: Career[];
  onApply: (title: string) => void;
  width?: string | number | { [key: string]: string | number };
};

const CareersList = ({
  careers,
  onApply,
  width = "100%",
}: CareersListProps) => {
  const { lang } = useLanguage();
  const careersTranslation = getCareersTranslation(lang);
  const buttonTranslation = getButtonTranslation(lang);
  const careersPageSlug = getPageSlugByKey("careers");

  return (
    <Box
      sx={{
        width,
        // Vacancies are full-width rows in the design, not a card grid.
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {careers.map((career) => (
        <CareerPreviewCard
          key={career.id}
          href={withBasePath(
            `/${careersPageSlug}/${getCareerSlugById(career.id)}`,
          )}
          title={career.title}
          text={career.text}
          requirements={career.requirements}
          requirementsLabel={careersTranslation.requirementsTitle}
          applyLabel={buttonTranslation.applyNow}
          onApply={() => onApply(career.title)}
        />
      ))}
    </Box>
  );
};

export default CareersList;
