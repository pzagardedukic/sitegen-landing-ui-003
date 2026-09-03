import { PriceUnitType } from "@/core/types";
import { useLanguage } from "@/core/runtime";
import {
  getPriceTranslation,
  getPricingUnitTranslation,
} from "@/core/translations";
import Typography from "@mui/material/Typography";

type PriceValueProps = {
  value: string;
  currency: string;
  unit?: PriceUnitType;
  onAgreement: boolean;
  discountedValue: string;
};

export default function PriceValue({
  value,
  currency,
  onAgreement,
  discountedValue,
  unit,
}: PriceValueProps) {
  const { lang } = useLanguage();
  const t = getPriceTranslation(lang);
  const tUnit = getPricingUnitTranslation(unit, lang);

  const finalValue = discountedValue || value;

  return (
    <Typography
      fontWeight={onAgreement ? 500 : 600}
      color={onAgreement ? "text.secondary" : "primary"}
      fontStyle={onAgreement ? "italic" : "normal"}
    >
      {onAgreement ? (
        t.onAgreement
      ) : discountedValue ? (
        <>
          {/* Discounted price */}
          <Typography component="span" fontWeight={600} color="primary">
            {finalValue} {currency}
            {tUnit ? ` / ${tUnit}` : ""}
          </Typography>

          {/* Original price */}
          <Typography
            component="span"
            sx={{
              ml: 1,
              textDecoration: "line-through",
              color: "text.secondary",
              fontWeight: 400,
            }}
          >
            {value} {currency}
          </Typography>
        </>
      ) : (
        <>
          {finalValue} {currency}
          {tUnit ? ` / ${tUnit}` : ""}
        </>
      )}
    </Typography>
  );
}
