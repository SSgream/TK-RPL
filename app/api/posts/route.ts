// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - Ambil semua posts
export async function GET(req: Request) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        ukm: {
          select: {
            id: true,
            name: true,
            verified: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts ERROR:", error);
    return NextResponse.json(
      { error: 'Gagal mengambil data posts' },
      { status: 500 }
    );
  }
}

// POST - Buat post baru
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const ukmId = formData.get("ukmId") as string | null;
    const imageUrl = formData.get("imageUrl") as string | null;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title dan content wajib diisi" },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        authorId: parseInt(session.user.id),
        ukmId: ukmId ? parseInt(ukmId) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ukm: {
          select: {
            id: true,
            name: true,
            verified: true,
            imageUrl: true
          }
        }
      },
    });

    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error("POST /api/posts ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}