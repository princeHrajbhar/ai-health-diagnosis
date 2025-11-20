'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Appointment {
    _id: string;
    date: string;
    patientId: {
        name: string;
        email: string;
    };
    status: string;
    notes: string;
}

export default function DoctorDashboard() {
    const { data: session, status } = useSession();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (session?.user?.role === 'patient') {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'doctor') {
            fetch('/api/doctor/appointments')
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setAppointments(data);
                    }
                });
        }
    }, [session]);

    if (status === 'loading') return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Doctor Dashboard
                    </h1>
                    <p className="text-gray-600">Welcome, Dr. {session?.user?.name}</p>
                </header>

                <section className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Upcoming Appointments
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Notes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((apt) => (
                                    <tr key={apt._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {apt.patientId.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {apt.patientId.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(apt.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {apt.notes}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No upcoming appointments found.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
