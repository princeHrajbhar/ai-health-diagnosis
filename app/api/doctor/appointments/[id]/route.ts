import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Diagnosis from '@/models/Diagnosis';
import User from '@/models/User';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session || !session.user || session.user.role !== 'doctor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const appointment = await Appointment.findById(id)
            .populate('patientId', 'name email')
            .populate('diagnosisId');

        if (!appointment) {
            return NextResponse.json(
                { error: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Ensure the appointment belongs to the requesting doctor
        if (appointment.doctorId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(appointment);
    } catch (error) {
        console.error('Appointment details error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
