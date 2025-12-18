import { NextRequest,NextResponse} from "next/server";
import bcrypt from "bcrypt";
import {prisma} from "@/lib/prisma"

export async function POST(req:NextRequest) {
    const{email,password}=await req.json()

      if (!email || !password) {
        return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }
   const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashed=await bcrypt.hash(password,10)

  await prisma.user.create({
    data:{
        email,
        password:hashed
    }
  })
    return NextResponse.json({ success: true });
  
}