import { NextResponse } from 'next/server';
import { verifyOTP } from '../send-otp/route';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const verificationResult = verifyOTP(email, otp);

    if (!verificationResult.valid) {
      return NextResponse.json(
        { error: verificationResult.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
} 