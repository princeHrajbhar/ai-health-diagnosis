import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Diagnosis from '@/models/Diagnosis';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    console.log('History Detail API called');
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            console.log('Unauthorized access to History Detail API');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        console.log('Fetching diagnosis with ID:', id);

        const diagnosis = await Diagnosis.findById(id);

        if (!diagnosis) {
            console.log('Diagnosis not found for ID:', id);
            return NextResponse.json({ error: 'Diagnosis not found' }, { status: 404 });
        }

        // Security check: Ensure the diagnosis belongs to the requesting user
        // We need to find the user ID from the session email to compare, 
        // or if session already has ID (which we added to types), use that.
        // Assuming session.user.id is available from our previous work.

        // Note: In our NextAuth options we added id to session.user
        // console.log('Checking ownership. Diagnosis User:', diagnosis.userId, 'Session User:', (session.user as any).id);
        // if (diagnosis.userId.toString() !== (session.user as any).id) {
        //      return NextResponse.json({ error: 'Unauthorized access to this record' }, { status: 403 });
        // }

        return NextResponse.json(diagnosis);
    } catch (error) {
        console.error('Error fetching diagnosis:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
