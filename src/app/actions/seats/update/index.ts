'use server'
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {salable} from "@/app/salable";
import {SeatActionType} from "@salable/node-sdk/dist/src/types";

const zodUpdateSeatRequestBody = z.object({
  subscriptionUuid: z.string().uuid(),
  granteeId: z.string().nullable(),
  currentGranteeId: z.string().nullable().optional(),
});
type UpdateSeatRequestBody = z.infer<typeof zodUpdateSeatRequestBody>

export async function updateSeat(formData: UpdateSeatRequestBody, revalidatePage: string) {
  try {
    const data = zodUpdateSeatRequestBody.parse(formData)
    
    // Determine the operation type
    let method: any;
    
    if (data.granteeId === null && data.currentGranteeId) {
      // Unassign operation
      method = {
        type: SeatActionType.unassign,
        granteeId: data.currentGranteeId
      };
    } else if (data.granteeId && data.currentGranteeId) {
      // Replace operation
      method = {
        type: SeatActionType.replace,
        granteeId: data.currentGranteeId,
        newGranteeId: data.granteeId
      };
    } else if (data.granteeId) {
      // Assign operation
      method = {
        type: SeatActionType.assign,
        granteeId: data.granteeId
      };
    }
    
    await salable.subscriptions.manageSeats(data.subscriptionUuid, [method])
  } catch (error) {
    console.log(error)
    return {
      data: null,
      error: 'Failed to update seat'
    };
  }
  revalidatePath(revalidatePage)
}

