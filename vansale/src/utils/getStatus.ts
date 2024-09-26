import {DELIVERY_STATUS_CONST, TRIP_STATUS} from "./constants";
import {DeliveryStop, DeliveryTripDetails} from "./types";
import {formatDate} from "./formatDate.ts";

export const getDeliveryStatus = (doc: DeliveryStop | undefined): string => {
  if (!doc) return DELIVERY_STATUS_CONST.PENDING;

  if (doc.visited) return DELIVERY_STATUS_CONST.DELIVERED;

  if (doc.custom_in_transition) return DELIVERY_STATUS_CONST.IN_TRANSIT;

  return DELIVERY_STATUS_CONST.PENDING;
};

export const getTripStatus = (doc: DeliveryTripDetails): { "status": string, "message": string } => {
  if (!doc) return {
    "status": TRIP_STATUS.UPCOMING,
    "message": TRIP_STATUS.UPCOMING,
  };

  if (doc?.status && doc.status === TRIP_STATUS.SCHEDULED && doc?.departure_time) {
    const date = formatDate(doc.departure_time);

    if (date === "Today") {
      return { "status": TRIP_STATUS.SCHEDULED, "message": `${TRIP_STATUS.SCHEDULED} for ${formatDate(doc?.departure_time ?? "")}`};
    }
    return { "status": TRIP_STATUS.UPCOMING, "message": TRIP_STATUS.UPCOMING};
  }

  if (doc?.status && doc.status === TRIP_STATUS.COMPLETED) {
    return { "status": TRIP_STATUS.COMPLETED, "message": TRIP_STATUS.COMPLETED};
  }

  return { "status": TRIP_STATUS.UPCOMING, "message": TRIP_STATUS.UPCOMING};
};