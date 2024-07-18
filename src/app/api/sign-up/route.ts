import {NextRequest, NextResponse} from "next/server";
import {randomBytes} from "crypto";
import {hashString} from "@/utils/hash-string";
import {getIronSession} from "iron-session";
import {cookies} from "next/headers";
import {db} from "@/drizzle/drizzle";
import {organisationsTable, usersOrganisationsTable, usersTable} from "@/drizzle/schema";
import {eq} from "drizzle-orm";
import {Session} from "@/app/settings/subscriptions/[uuid]/page";

type SignUpRequestBody = {
  organisationName: string
  username: string
  email: string
  password: string
}

export async function POST(req: NextRequest) {
  try {
    const body: SignUpRequestBody = await req.json()

    const existingUsersResult = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (existingUsersResult.length > 1) throw new Error("User already exists")

    const existingOrganisationsResult = await db.select().from(organisationsTable).where(eq(organisationsTable.name, body.organisationName))
    if (existingOrganisationsResult.length > 1) throw new Error("Organisation already exists")

    const salt = randomBytes(16).toString('hex');
    const hash = hashString(body.password, salt)

    const createOrg = await db.insert(organisationsTable).values({name: body.organisationName}).returning();
    const organisation = createOrg[0]
    const createUser = await db.insert(usersTable).values({
      username: body.username,
      email: body.email,
      salt,
      hash
    }).returning();
    const user = createUser[0]

    await db.insert(usersOrganisationsTable).values({userId: user.id, organisationId: organisation.id});

    const session = await getIronSession<Session>(cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session" });
    session.id = user.id.toString();
    session.organisationId = organisation.id.toString()
    if (user.email) session.email = user.email
    await session.save();

    return NextResponse.json({id: user.id, organisationId: organisation.id},
      { status: 200 }
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