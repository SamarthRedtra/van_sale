import { DELIVERY_STATUS_CONST } from "./constants";
import { DeliveryStop } from "./types";

export const getDeliveryStatus = (doc: DeliveryStop | undefined): string => {
  if (!doc) return DELIVERY_STATUS_CONST.PENDING;

  if (doc.visited) return DELIVERY_STATUS_CONST.DELIVERED;

  if (doc.custom_in_transition) return DELIVERY_STATUS_CONST.IN_TRANSIT;

  return DELIVERY_STATUS_CONST.PENDING;
};
