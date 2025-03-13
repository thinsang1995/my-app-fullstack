import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { email, name } = await req.json()
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
    },
  })
  return NextResponse.json(newUser, { status: 201 })
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const { id, email, name } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

  const updateUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      email,
      name,
    },
  })
  return NextResponse.json(updateUser, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  })
  return NextResponse.json({ message: 'Deleted' })
}
