"use client";

import { useLanguage } from "@/core/runtime";
import { getFormTranslation } from "@/core/translations";
import { Typography, Link } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getPageSlugByKeyWithBasePath } from "@/core/static";

type FormDisclaimerProps = {
  isHighContrast?: boolean;
};

export default function FormDisclaimer({
  isHighContrast = false,
}: FormDisclaimerProps) {
  const { lang } = useLanguage();
  const formTranslations = getFormTranslation(lang);
  const legalPageHref = getPageSlugByKeyWithBasePath("legal");

  return (
    <Typography
      color={isHighContrast ? "secondary.contrastText" : "text.primary"}
      variant="body2"
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        lineHeight: 1.3,
      }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 20, mr: 0.6 }} />
      {formTranslations.disclaimerPrefix}&nbsp;
      <Link
        href={legalPageHref}
        color={isHighContrast ? "secondary.contrastText" : "text.primary"}
        underline="always"
        sx={{ fontWeight: 600 }}
      >
        {formTranslations.termsAndConditions}
      </Link>
      &nbsp;{formTranslations.disclaimerJoiner}&nbsp;
      <Link
        href={legalPageHref}
        color={isHighContrast ? "secondary.contrastText" : "text.primary"}
        underline="always"
        sx={{ fontWeight: 600 }}
      >
        {formTranslations.privacyPolicy}
      </Link>
      .
    </Typography>
  );
}
