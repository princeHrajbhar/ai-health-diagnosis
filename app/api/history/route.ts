import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Diagnosis from '@/models/Diagnosis';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const diagnoses = await Diagnosis.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        return NextResponse.json(diagnoses);
    } catch (error) {
        console.error('History fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
