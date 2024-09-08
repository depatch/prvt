import { NextResponse } from 'next/server';
import { saveClub } from '@/utils/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, groupId, members } = body;

    const club = {
      id: Date.now().toString(),
      name,
      groupId,
      members,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveClub(club);

    return NextResponse.json({ success: true, club });
  } catch (error) {
    console.error('Failed to create club:', error);
    return NextResponse.json({ success: false, error: 'Failed to create club' }, { status: 500 });
  }
}