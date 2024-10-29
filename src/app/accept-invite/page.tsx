'use client'
import React, {useState} from "react";
import Head from "next/head";
import {Resolver, useForm} from "react-hook-form";
import {useRouter, useSearchParams} from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import useSWR from "swr";
import {Session} from "@/app/settings/subscriptions/[uuid]/page";

export default function AcceptInvite() {
  return (
    <>
      <Head>
        <title>Salable Seats Demo</title>
      </Head>
      <main>
        <div className="w-full font-sans text-sm">
          <Main />
        </div>
      </main>
    </>
  );
}

type FormValues = {
  username: string;
  email: string;
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  const errors = () => {
    const obj: Record<string, {
      type: string;
      message: string;
    }> = {}
    if (!values.username) {
      obj.firstName = {
        type: 'required',
        message: 'Username is required.',
      }
    }
    if (!values.password) {
      obj.password = {
        type: 'required',
        message: 'Password is required.',
      }
    }
    return obj
  }
  return {
    values: values ?? {},
    errors: errors(),
  };
};

const Main = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {mutate: mutateSession} = useSWR<Session>(`/api/session`)
  const token = searchParams.get('token')
  const licenseUuid = searchParams.get('licenseUuid')
  const { register, handleSubmit, setError, formState: { errors, isSubmitting,  } } = useForm<FormValues>({ resolver });
  const onSubmit = handleSubmit(async (data) => {
    try {
      const userResponse = await fetch('/api/accept-invite', {
        method: 'post',
        body: JSON.stringify({
          ...data,
          token,
          ...(licenseUuid && {licenseUuid})
        })
      })
      if (!userResponse.ok) {
        const data = await userResponse.json()
        setError("root.serverError", {
          type: "400",
          message: data.error
        })
        return
      }
      await mutateSession()
      router.push('/')
    } catch (e) {
      console.log(e)
    }
  });
  return (
    <>
      <div className='max-w-[500px] m-auto'>
        <h1 className='text-3xl mb-4'>Sign up</h1>
        <form onSubmit={onSubmit} className='grid gap-3'>
          <fieldset>
            <input className='p-3 w-full' {...register("username")} placeholder="Username"/>
            {errors.username && <p className='text-red-600'>{errors.username.message}</p>}
          </fieldset>

          <fieldset>
            <input type="password" className='p-3 w-full' {...register("password")} placeholder="Password"/>
            {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
          </fieldset>

          <div>
            <button
              className={`p-4 text-white rounded-md leading-none bg-blue-700`}
            >
              {!isSubmitting ? "Sign up" : <div className='w-[15px]'><LoadingSpinner fill="white"/></div>}
            </button>
          </div>
          {errors.root?.serverError ? (
            <div className='bg-red-500 text-white p-2 rounded-sm'>
              {errors.root?.serverError.message}
            </div>
          ) : null}
        </form>
      </div>
    </>
  )
}