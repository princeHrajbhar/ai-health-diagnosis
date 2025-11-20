'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Doctor {
    _id: string;
    name: string;
    specialty: string;
    email: string;
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/doctors')
            .then((res) => res.json())
            .then((data) => {
                setDoctors(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center">Loading doctors...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Find a Specialist
                </h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {doctors.map((doctor) => (
                        <div
                            key={doctor._id}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                    {doctor.name[0]}
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Dr. {doctor.name}
                                    </h2>
                                    <p className="text-indigo-600 text-sm">{doctor.specialty}</p>
                                </div>
                            </div>

                            <Link
                                href={`/appointments/book/${doctor._id}`}
                                className="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition font-medium"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    ))}
                </div>

                {doctors.length === 0 && (
                    <div className="text-center text-gray-500 mt-12">
                        No doctors available at the moment.
                    </div>
                )}
            </div>
        </div>
    );
}
