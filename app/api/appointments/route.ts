import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function POST(req: Request) {
    console.log('Create Appointment API called');
    try {
        const { doctorId, date, notes, diagnosisId } = await req.json();
        console.log('Appointment details:', { doctorId, date, diagnosisId });

        if (!doctorId || !date) {
            return NextResponse.json(
                { error: 'Doctor and Date are required' },
                { status: 400 }
            );
        }

        await dbConnect();
        console.log('Database connected');

        // Basic validation: check if doctor exists (omitted for brevity, but good practice)

        const appointment = await Appointment.create({
            // In a real app, we'd get patientId from session
            // patientId: session.user.id, 
            doctorId,
            date,
            notes,
            diagnosisId,
            status: 'pending'
        });

        console.log('Appointment created:', appointment._id);

        return NextResponse.json(
            { message: 'Appointment booked successfully', appointment },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
