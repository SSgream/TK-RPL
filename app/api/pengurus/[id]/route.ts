import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs" // Install: npm install bcryptjs

export async function GET(req: Request, context: any) {
  const { id } = await context.params

  console.log("GET PARAM ID:", id)

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(id) }
  })

  return NextResponse.json(user)
}

export async function DELETE(req: Request, context: any) {
  const { id } = await context.params

  console.log("DELETE PARAM ID:", id)

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  await prisma.user.delete({
    where: { id: Number(id) }
  })

  return NextResponse.json({ success: true })
}

export async function PUT(req: Request, context: any) {
  const { id } = await context.params
  const body = await req.json()

  console.log("EDIT ID:", id)
  console.log("EDIT BODY:", body)

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  // Data yang akan diupdate
  const updateData: any = {
    name: body.name,
    email: body.email,
  }

  // Jika ada password baru, hash dan tambahkan ke data
  if (body.password && body.password.trim() !== "") {
    const hashedPassword = await bcrypt.hash(body.password, 10)
    updateData.password = hashedPassword
  }

  await prisma.user.update({
    where: { id: Number(id) },
    data: updateData,
  })

  return NextResponse.json({ success: true })
}