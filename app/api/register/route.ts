import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    console.log('Register API called');
    try {
        const { name, email, password, role, specialty } = await req.json();
        console.log('Registering user:', email, role);

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();
        console.log('Database connected');

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'patient',
            specialty: role === 'doctor' ? specialty : undefined,
        });

        console.log('User created successfully:', user._id);

        return NextResponse.json(
            { message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in register API:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
