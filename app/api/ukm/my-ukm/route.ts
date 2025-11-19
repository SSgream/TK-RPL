import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cari UKM yang createdBy-nya adalah user yang login
  const ukm = await prisma.uKM.findFirst({
    where: { createdBy: session.user.id },
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