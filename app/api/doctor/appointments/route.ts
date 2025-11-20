import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'doctor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const appointments = await Appointment.find({ doctorId: session.user.id })
            .populate('patientId', 'name email')
            .sort({ date: 1 });

        return NextResponse.json(appointments);
    } catch (error) {
        console.error('Doctor appointments error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
