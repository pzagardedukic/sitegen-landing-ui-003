import HoverZoomImage from "@/components/image/HoverZoomImage";
import { Box, Typography } from "@mui/material";
import PriceValue from "../common/PriceValue";
import DiscountBadge from "../common/DiscountBadge";
import StatusBadge from "../common/StatusBadge";
import { stripRichText, truncateWordSafe } from "@/core/utils";
import { PriceUnitType, PricingItemStatus } from "@/core/types";

type StoreItemCardProps = {
  image?: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  unit?: PriceUnitType;
  onAgreement: boolean;
  discountedValue: string;
  status?: PricingItemStatus;
};

/*
 * Store card: bordered rather than raised, and the text set left. The badges stay on the
 * picture, which is the only place they do not push the title off its line when a customer
 * has both a status and a discount on the same item.
 */
export default function StoreItemCard({
  image,
  title,
  description,
  price,
  currency,
  unit,
  onAgreement,
  discountedValue,
  status,
}: StoreItemCardProps) {
  const truncatedText = stripRichText(truncateWordSafe(description, 100));

  return (
    <Box
      className="zoom-image-parent"
      sx={(theme) => ({
        position: "relative",
        borderRadius: "25px",
        border: `1px solid ${theme.palette.surfaces.border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: theme.transitions.create(["border-color"]),
        "&:hover": {
          cursor: "pointer",
          borderColor: theme.palette.primary.main,
        },
      })}
    >
      {/* Status */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 2,
        }}
      >
        <StatusBadge status={status} />
      </Box>

      {/* Discount */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 2,
        }}
      >
        <DiscountBadge price={price} discountedValue={discountedValue} />
      </Box>

      {/* Image */}
      <HoverZoomImage
        src={image}
        alt={title}
        zoomOnParentHover
        sx={{
          width: "100%",
          height: 180,
          objectFit: "cover",
        }}
      />

      {/* Content */}
      <Box px={2.5} py={2.5} flexGrow={1}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {truncatedText}
        </Typography>
      </Box>

      {/* Price */}
      <Box
        sx={(theme) => ({
          px: 2.5,
          py: 1.5,
          mt: "auto",
          borderTop: `1px solid ${theme.palette.surfaces.border}`,
        })}
      >
        <PriceValue
          value={price}
          currency={currency}
          unit={unit}
          onAgreement={onAgreement}
          discountedValue={discountedValue}
        />
      </Box>
    </Box>
  );
}
