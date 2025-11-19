import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET kegiatan milik user yang login
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔥 Ambil hanya kegiatan yang dibuat oleh user yang login
  const kegiatan = await prisma.kegiatan.findMany({
    where: {
      authorId: session.user.id, // Filter berdasarkan authorId
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      ukm: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(kegiatan);
}

// POST tambah kegiatan baru
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const newKegiatan = await prisma.kegiatan.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: session.user.id, // 🔥 Otomatis dari session
      ukmId: body.ukmId || null,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(newKegiatan);
}