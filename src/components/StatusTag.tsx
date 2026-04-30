import { getCategoryLabel, getStatusLabel } from "../lib/format";
import type { ExpenseCategory, TripStatus } from "../types/trip";

type StatusTagProps =
  | {
      type: "status";
      value: TripStatus;
    }
  | {
      type: "category";
      value?: ExpenseCategory;
    };

export const StatusTag = (props: StatusTagProps) => {
  if (props.type === "status") {
    return (
      <span className={`tag tag--${props.value}`}>
        {getStatusLabel(props.value)}
      </span>
    );
  }

  return (
    <span className={`tag tag--${props.value ?? "other"}`}>
      {getCategoryLabel(props.value)}
    </span>
  );
};
