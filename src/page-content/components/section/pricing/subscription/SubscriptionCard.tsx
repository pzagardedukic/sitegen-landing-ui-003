"use client";

import { Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import PriceValue from "../common/PriceValue";
import Tag from "@/components/common/Tag";
import StatusBadge from "../common/StatusBadge";
import GradientButton from "@/components/button/GradientButton";
import { stripRichText } from "@/core/utils";
import { PriceUnitType, PricingItemStatus } from "@/core/types";
import { getPricingTranslation_packagesNoImages } from "@/core/translations";
import { useLanguage } from "@/core/runtime";

export type SubscriptionFeature = {
  label: string;
  value: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  subtitle?: string;
  category?: string;
  status?: PricingItemStatus;
  price: string;
  currency: string;
  unit?: PriceUnitType;
  onAgreement: boolean;
  discountedValue: string;
  features: SubscriptionFeature[];
  highlight?: boolean;
};

type Props = {
  plan: SubscriptionPlan;
  onSelect: (title: string) => void;
};

/*
 * A package from the Figma frame (373x579): status badge, title, a line of text, the
 * category, then the price, then the feature rows with the label on the left and its value
 * on the right, and the button at the bottom.
 *
 * The recommended package is marked with a gradient outline rather than a heavier shadow —
 * the design has no raised cards anywhere.
 */
export default function SubscriptionCard({ plan, onSelect }: Props) {
  const {
    name,
    subtitle,
    category,
    status,
    price,
    currency,
    unit,
    onAgreement,
    discountedValue,
    features,
    highlight = false,
  } = plan;

  const { lang } = useLanguage();
  const t = getPricingTranslation_packagesNoImages(lang);

  const cleanSubtitle = subtitle ? stripRichText(subtitle) : "";

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        height: "100%",
        borderRadius: "25px",
        p: "30px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        border: `1px solid ${highlight ? "transparent" : theme.palette.surfaces.border}`,
        backgroundColor: highlight ? theme.palette.surfaces.tint : "transparent",
        ...(highlight && {
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -1,
            borderRadius: "26px",
            padding: "1px",
            backgroundImage: theme.palette.brandGradient,
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          },
        }),
      })}
    >
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", minHeight: 29 }}>
        {highlight && <Tag label={t.items.recommended} tone="brand" />}
        <StatusBadge status={status} />
      </Box>

      <Typography variant="h4" component="h3">
        {name}
      </Typography>

      {cleanSubtitle && (
        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          {cleanSubtitle}
        </Typography>
      )}

      {category && (
        <Typography variant="caption" sx={{ opacity: 0.55 }}>
          {category}
        </Typography>
      )}

      <Box sx={{ mt: 1 }}>
        <PriceValue
          value={price}
          currency={currency}
          unit={unit}
          onAgreement={onAgreement}
          discountedValue={discountedValue}
        />
      </Box>

      {features.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={(theme) => ({
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                py: 0.75,
                borderBottom:
                  index < features.length - 1
                    ? `1px solid ${theme.palette.surfaces.border}`
                    : "none",
              })}
            >
              <Typography variant="body2" sx={{ opacity: 0.72 }}>
                {feature.label}
              </Typography>

              <Typography variant="subtitle2" sx={{ textAlign: "right" }}>
                {feature.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mt: "auto", pt: 2 }}>
        <GradientButton
          fullWidth
          onClick={() => onSelect(name)}
          endIcon={<ArrowOutwardIcon />}
        >
          {t.items.callToAction}
        </GradientButton>
      </Box>
    </Box>
  );
}
