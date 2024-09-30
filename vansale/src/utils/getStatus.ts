import { DELIVERY_STATUS_CONST, TRIP_STATUS } from "./constants";
import { DeliveryStop, DeliveryTripDetails } from "./types";
import { formatDate } from "./formatDate.ts";

export const getDeliveryStatus = (doc: DeliveryStop | undefined): string => {
  if (!doc) return DELIVERY_STATUS_CONST.PENDING;

  if (doc.visited) return DELIVERY_STATUS_CONST.DELIVERED;

  if (doc.custom_in_transition) return DELIVERY_STATUS_CONST.IN_TRANSIT;

  return DELIVERY_STATUS_CONST.PENDING;
};

export const getTripStatus = (
  doc: DeliveryTripDetails
): { status: string; message: string } => {
  if (!doc || !doc.status)
    return {
      status: TRIP_STATUS.UPCOMING,
      message: TRIP_STATUS.UPCOMING,
    };

  if (
    (doc.status === TRIP_STATUS.SCHEDULED && doc?.departure_time) ||
    doc.status === TRIP_STATUS.IN_TRANSIT
  ) {
    const date = formatDate(doc.departure_time);

    if (date === "Today") {
      return {
        status: TRIP_STATUS.SCHEDULED,
        message: `${TRIP_STATUS.SCHEDULED} for ${formatDate(
          doc?.departure_time ?? ""
        )}`,
      };
    }

    if (doc.departure_time) {
      let departureTime = new Date(doc.departure_time);

      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (date === "Yesterday" || departureTime < yesterday) {
        return { status: TRIP_STATUS.OVERDUE, message: TRIP_STATUS.OVERDUE };
      }
    }
    return { status: TRIP_STATUS.UPCOMING, message: TRIP_STATUS.UPCOMING };
  }

  if (doc.status === TRIP_STATUS.COMPLETED) {
    return { status: TRIP_STATUS.COMPLETED, message: TRIP_STATUS.COMPLETED };
  }

  return { status: TRIP_STATUS.UPCOMING, message: TRIP_STATUS.UPCOMING };
};
