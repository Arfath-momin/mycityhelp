import { NextResponse } from 'next/server';
import { generateOTP, sendOTP } from '@/utils/otpService';
import otpStore from '@/utils/otpStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send OTP via email
    const result = await sendOTP(email, otp);
    
    if (!result.success) {
      // If email fails, remove OTP from store
      otpStore.delete(email);
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

// Helper function to verify OTP
export const verifyOTP = (email, userOTP) => {
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return { valid: false, message: 'OTP not found or expired' };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email); // Clean up expired OTP
    return { valid: false, message: 'OTP expired' };
  }

  if (storedData.otp !== userOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }

  // Clean up used OTP
  otpStore.delete(email);
  return { valid: true };
}; 