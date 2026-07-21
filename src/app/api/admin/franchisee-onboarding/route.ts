import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(true); // Ensure admin is logged in
    const records = await db.franchiseeOnboarding.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('Failed to fetch franchisee onboarding records:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(true);

    const data = await req.json();
    const { name, email, phone, companyName, address, experience, status, notes, photo } = data;

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Name, email, and phone are required' }, { status: 400 });
    }

    const record = await db.franchiseeOnboarding.create({
      data: {
        name,
        email,
        phone,
        companyName: companyName || null,
        address: address || null,
        experience: experience || null,
        status: status || 'PENDING',
        notes: notes || null,
        photo: photo || null,
      }
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Failed to create franchisee onboarding record:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(true);

    const data = await req.json();
    const { id, name, email, phone, companyName, address, experience, status, notes, photo } = data;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required for updating' }, { status: 400 });
    }

    const record = await db.franchiseeOnboarding.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        email,
        phone,
        companyName,
        address,
        experience,
        status,
        notes,
        photo,
      }
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Failed to update franchisee onboarding record:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(true);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await db.franchiseeOnboarding.delete({
      where: { id: parseInt(id, 10) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete franchisee onboarding record:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
