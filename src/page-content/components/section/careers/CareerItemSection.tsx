"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { getCareersItems } from "@/core/runtime";
import { getPageSlugByKey } from "@/core/static";
import { useLanguage } from "@/core/runtime";
import {
  getButtonTranslation,
  getCareersTranslation,
} from "@/core/translations";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import BackButton from "@/components/button/BackButton";
import GradientButton from "@/components/button/GradientButton";
import SectionDescription from "../common/SectionDescription";
import ShareActions from "../common/ShareActions";

/*
 * Job detail. The title is already on the banner above, so the section opens with the back
 * button and reads as one 760 column — same measure as the post detail, because both are
 * long-form text and a wider column makes the requirement lines hard to track.
 *
 * Applying and sharing sit together on the closing rule: the two things a reader does once
 * they have finished reading, not one at the top competing with the text.
 */
export default function CareerItemSection({ id }: { id: number }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const career = getCareersItems(lang).find((item) => item.id === id);
  const careersTranslation = getCareersTranslation(lang);
  const buttonTranslation = getButtonTranslation(lang);

  if (!career) {
    return null;
  }

  const handleBackToCareers = () => {
    router.push(`/${getPageSlugByKey("careers")}`);
  };

  const handleApply = () => {
    const subject = `${careersTranslation.applicationSubject}: ${career.title}`;

    router.push(
      `/${getPageSlugByKey("contact")}?subject=${encodeURIComponent(subject)}`,
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 760,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 4, md: 5 },
      }}
    >
      <BackButton
        label={careersTranslation.backToCareers}
        onClick={handleBackToCareers}
      />

      <SectionDescription description={career.text} textAlign="left" />

      {career.requirements.length > 0 && (
        <Box>
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            {careersTranslation.requirementsTitle}
          </Typography>

          <List disablePadding>
            {career.requirements.map((requirement, index) => (
              <ListItem
                key={index}
                disableGutters
                alignItems="flex-start"
                sx={{ py: 0.75 }}
              >
                <ListItemIcon sx={{ minWidth: 36, mt: "2px" }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={requirement}
                  primaryTypographyProps={{
                    variant: "body1",
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {career.note && (
        <Box
          sx={(theme) => ({
            borderRadius: "25px",
            border: `1px solid ${theme.palette.surfaces.border}`,
            backgroundColor: theme.palette.surfaces.tint,
            px: { xs: 2.5, sm: 3 },
            py: 2.5,
          })}
        >
          <SectionDescription description={career.note} textAlign="left" />
        </Box>
      )}

      <Divider />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 4,
        }}
      >
        <GradientButton
          onClick={handleApply}
          endIcon={<ArrowOutwardIcon />}
          sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
        >
          {buttonTranslation.applyNow}
        </GradientButton>

        <ShareActions title={career.title} />
      </Box>
    </Box>
  );
}
