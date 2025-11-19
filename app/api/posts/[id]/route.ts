import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET detail post
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}

// PATCH update post
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  const updatedPost = await prisma.post.update({
    where: { id: parseInt(id) },
    data,
  });

  return NextResponse.json(updatedPost);
}

// DELETE hapus post
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.post.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ message: "Post deleted" });
}
