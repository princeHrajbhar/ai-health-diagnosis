'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function BookAppointmentPage({
    params,
    searchParams
}: {
    params: Promise<{ doctorId: string }>,
    searchParams: Promise<{ diagnosisId?: string }>
}) {
    const { doctorId } = use(params);
    const { diagnosisId } = use(searchParams);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dateTime = new Date(`${date}T${time}`);

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId,
                    date: dateTime,
                    notes,
                    diagnosisId,
                }),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                alert('Failed to book appointment');
            }
        } catch (error) {
            console.error(error);
            alert('Error booking appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Book Appointment
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time
                        </label>
                        <input
                            type="time"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes for Doctor
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Booking...' : 'Confirm Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
