import Tag from "@/components/common/Tag";

type DiscountBadgeProps = {
  price: string;
  discountedValue?: string;
};

/*
 * The discount mark carries the brand gradient rather than the old red fill: red is the
 * error color and reads as a warning, and a customer whose palette has no red got a badge
 * that belonged to no part of their site.
 */
export default function DiscountBadge({
  price,
  discountedValue,
}: DiscountBadgeProps) {
  if (!price || !discountedValue) return null;

  const original = Number(price);
  const discounted = Number(discountedValue);

  if (
    Number.isNaN(original) ||
    Number.isNaN(discounted) ||
    discounted >= original
  ) {
    return null;
  }

  const discountPercent = Math.round(
    ((original - discounted) / original) * 100,
  );

  if (discountPercent <= 0) return null;

  return <Tag label={`- ${discountPercent} %`} tone="brand" />;
}
