/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET() {
    const user = await client.user.findFirst({});
    return Response.json({ name: user?.name, email: user?.email, password: user?.password })
}
