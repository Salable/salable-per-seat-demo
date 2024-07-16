'use client'
import React, {useEffect} from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";

export type SalableSubscription = {
  uuid: string;
  paymentIntegrationSubscriptionId: string;
  productUuid: string;
  type: string;
  email: string;
  organisation: string;
  status: string;
  quantity: number,
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
  lineItemIds: string[],
  planUuid: string;
  isTest: boolean;
  plan: {
    uuid: string;
    displayName: string;
    interval: string;
    currencies: {
      price: number
    }[]
  }
}

export type GetAllSubscriptionsResponse = {
  first: string;
  last: string;
  data: SalableSubscription[]
}

export default function Dashboard() {
  return (
    <>
      <Head><title>Salable Seats Demo</title></Head>
      <main>
        <div className="w-full font-sans text-sm">
          <ToastContainer/>
          <Main/>
        </div>
      </main>
    </>
  );
}

const Main = () => {
  const {data, isLoading} = useSWR<GetAllSubscriptionsResponse>('/api/subscriptions')

  return (
    <>
      <div className='max-w-[1000px] m-auto'>
        <h1 className='text-3xl mb-4'>Subscriptions</h1>
        <div>
          {!isLoading ? (
            <div>
              {data?.data?.map((sub, i) => {
                return (
                  <div className='mb-1 p-2 bg-white rounded-sm shadow' key={sub.uuid}>
                    <div className='flex justify-between'>
                      <h2 className='mr-2'>{sub.uuid} {sub.plan?.displayName}</h2>
                      <Link href={`/settings/subscriptions/${sub.uuid}`} className='text-blue-500'>View</Link>
                    </div>
                    <div>
                      {sub.quantity} Seats
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ml-3 w-[20px]">
              <LoadingSpinner/>
            </div>
          )}
        </div>
      </div>
    </>
  )
}