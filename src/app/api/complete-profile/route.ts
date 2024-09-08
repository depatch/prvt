import { NextResponse } from 'next/server';
import { saveUser } from '@/utils/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, username, email, bio, profilePicture, attestationId } = body;

    const user = {
      id: Date.now().toString(),
      address,
      username,
      email,
      bio,
      profilePicture,
      isCompleteProfile: true,
      attestationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveUser(user);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Failed to save user profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to save user profile' }, { status: 500 });
  }
}