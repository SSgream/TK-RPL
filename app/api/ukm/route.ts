import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"

// GET semua UKM
export async function GET() {
  const ukms = await prisma.uKM.findMany({
    orderBy: { name: "asc" },
  })
  return NextResponse.json(ukms)
}

// POST tambah UKM
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await req.json()

  const newUKM = await prisma.uKM.create({
    data: {
      name: body.name,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl || null,
      createdBy: body.createdBy,  // 🔥 dipilih dari dropdown
    },
  })

  return NextResponse.json(newUKM)
}

