import {Bytes} from "@/components/forms/string-generator-form";

if(!process.env.NEXT_PUBLIC_SALABLE_PLAN_UUID) throw new Error('Missing env NEXT_PUBLIC_SALABLE_PLAN_UUID')
if(!process.env.NEXT_PUBLIC_SALABLE_PRO_PLAN_UUID) throw new Error('Missing env NEXT_PUBLIC_SALABLE_PRO_PLAN_UUID')
if(!process.env.NEXT_PUBLIC_PRODUCT_UUID) throw new Error('Missing env NEXT_PUBLIC_PRODUCT_UUID')
if(!process.env.NEXT_PUBLIC_APP_BASE_URL) throw new Error('Missing env NEXT_PUBLIC_APP_BASE_URL')

export const salableApiBaseUrl = 'https://api.salable.app'
export const salableBasicPlanUuid = process.env.NEXT_PUBLIC_SALABLE_PLAN_UUID
export const salableProPlanUuid = process.env.NEXT_PUBLIC_SALABLE_PRO_PLAN_UUID
export const salableProductUuid = process.env.NEXT_PUBLIC_PRODUCT_UUID
export const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL
export const bytes: Bytes[] = ['16', "32", "64", "128"]