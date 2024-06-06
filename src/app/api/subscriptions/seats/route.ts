import {NextRequest, NextResponse} from "next/server";
import {env} from "@/app/environment";

export async function POST(req: NextRequest) {
  try {
    const res = await fetch(`${env.SALABLE_API_BASE_URL}/subscriptions/${env.SUBSCRIPTION_UUID}/seats`, {
      method: 'post',
      headers: {
        'x-api-key': env.SALABLE_API_KEY,
      },
      body: JSON.stringify(await req.json())
    })
    const data = await res.json()
    return NextResponse.json(
      data, { status: res.status }
    );
  } catch (e) {
    const error = e as Error
    console.log(error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const res = await fetch(`${env.SALABLE_API_BASE_URL}/subscriptions/${env.SUBSCRIPTION_UUID}/seats`, {
      method: 'put',
      headers: {
        'x-api-key': env.SALABLE_API_KEY,
      },
      body: JSON.stringify(await req.json())
    })
    const data = await res.json()
    return NextResponse.json(
      data, { status: res.status }
    );
  } catch (e) {
    const error = e as Error
    console.log(error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}