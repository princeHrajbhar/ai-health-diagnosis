import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Find all users with role 'doctor'
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        return NextResponse.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
