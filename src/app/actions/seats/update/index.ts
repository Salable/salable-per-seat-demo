'use server'
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {salable} from "@/app/salable";
import { ManageSeatOptions } from "@salable/node-sdk/dist/src/types";

const manageSeatOptionsSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('assign'),
    granteeId: z.string()
  }),
  z.object({
    type: z.literal('unassign'),
    granteeId: z.string()
  }),
  z.object({
    type: z.literal('replace'),
    granteeId: z.string(),
    newGranteeId: z.string()
  })
]);

const zodUpdateSeatRequestBody = z.object({
  subscriptionUuid: z.string().uuid(),
  seatOperation: manageSeatOptionsSchema
});

type UpdateSeatRequestBody = z.infer<typeof zodUpdateSeatRequestBody>

export async function updateSeat(formData: UpdateSeatRequestBody, revalidatePage: string) {
  try {
    const data = zodUpdateSeatRequestBody.parse(formData)
    
    await salable.subscriptions.manageSeats(data.subscriptionUuid, [
      data.seatOperation
    ] as ManageSeatOptions[])
  } catch (error) {
    console.log(error)
    return {
      data: null,
      error: 'Failed to update seat'
    };
  }
  revalidatePath(revalidatePage)
}

