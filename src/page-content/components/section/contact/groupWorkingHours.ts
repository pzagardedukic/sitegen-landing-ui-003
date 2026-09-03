const weekdayTags = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

type WorkingHourItem = {
  tag: string;
  open: boolean;
  from: string;
  to: string;
};

type GroupedHours = {
  label: string;
  days: string[];
  open: boolean;
  from?: string;
  to?: string;
};

export function groupWorkingHours(items: WorkingHourItem[]): GroupedHours[] {
  const weekdays = items.filter((i) => weekdayTags.includes(i.tag));
  const weekend = items.filter((i) => !weekdayTags.includes(i.tag));

  const allWeekdaysSame =
    weekdays.every((i) => i.open) &&
    weekdays.every(
      (i) => i.from === weekdays[0].from && i.to === weekdays[0].to,
    );

  const grouped: GroupedHours[] = [];

  if (allWeekdaysSame) {
    grouped.push({
      label: "Monday – Friday",
      days: weekdayTags,
      open: true,
      from: weekdays[0].from,
      to: weekdays[0].to,
    });
  } else {
    weekdays.forEach((i) =>
      grouped.push({
        label: i.tag,
        days: [i.tag],
        open: i.open,
        from: i.from,
        to: i.to,
      }),
    );
  }

  weekend.forEach((i) =>
    grouped.push({
      label: i.tag,
      days: [i.tag],
      open: i.open,
      from: i.from,
      to: i.to,
    }),
  );

  return grouped;
}
