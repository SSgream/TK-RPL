import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET detail UKM dengan posts
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ukm = await prisma.uKM.findUnique({
    where: { id: parseInt(id) },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!ukm) {
    return NextResponse.json({ error: "UKM not found" }, { status: 404 });
  }

  return NextResponse.json(ukm);
}

// PATCH update UKM
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  const ukm = await prisma.uKM.update({
    where: { id: parseInt(id) },
    data,
  });
  return NextResponse.json(ukm);
}

// DELETE hapus UKM
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.uKM.delete({
    where: { id: parseInt(id) },
  });
  return NextResponse.json({ message: "UKM deleted" });
}