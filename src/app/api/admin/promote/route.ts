import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { secret } = await req.json();

  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json(
      { error: "Invalid admin key" },
      { status: 403 }
    );
  }

  await prisma.user.update({
    where: { id: token.id as string },
    data: { role: "ADMIN" },
  });

  return NextResponse.json({ success: true });
}
