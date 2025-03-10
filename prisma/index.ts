import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { env } from "@/app/environment";

const libsql = createClient({ url: env.DATABASE_URL });
const adapter = new PrismaLibSQL(libsql);
export const prismaClient = new PrismaClient({ adapter });