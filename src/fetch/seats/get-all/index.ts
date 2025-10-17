import {Result} from "@/app/actions/checkout-link";
import {salable} from "@/app/salable";
import {PaginatedSeats, GetSubscriptionSeatsOptions} from "@salable/node-sdk/dist/src/types";

export async function getAllSeats(subscriptionUuid: string, params?: GetSubscriptionSeatsOptions): Promise<Result<PaginatedSeats>> {
  try {
    const data = await salable.subscriptions.getSeats(subscriptionUuid, params)
    return {
      data, error: null
    }
  } catch (e) {
    console.log(e)
    return {
      data: null,
      error: 'Failed to fetch seats'
    }
  }
}

