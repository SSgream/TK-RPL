import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  const pengurus = await prisma.user.findMany({
    where: { role: "pengurus" },
    select: { id: true, name: true, email: true }
  })

  return NextResponse.json(pengurus)
}

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  const hashed = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "pengurus",
    },
  })

  return Response.json(newUser)
}