'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface DiagnosisData {
    symptoms: string;
    aiAnalysis: {
        severity: string;
        summary: string;
        doctor_report: {
            clinical_summary: string;
            differential_diagnoses_reasoning: string;
            recommended_tests: string[];
            urgency_level: string;
            treatment_direction: string;
            red_flags: string[];
        };
    };
}

interface AppointmentDetail {
    _id: string;
    date: string;
    patientId: {
        name: string;
        email: string;
    };
    status: string;
    notes: string;
    diagnosisId?: DiagnosisData;
}

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.role === 'doctor') {
            fetch(`/api/doctor/appointments/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.error) {
                        setAppointment(data);
                    }
                    setLoading(false);
                });
        }
    }, [session, id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!appointment) return <div className="p-8">Appointment not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-indigo-600 hover:underline mb-4"
                    >
                        &larr; Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Appointment Details
                    </h1>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Patient & Appointment Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-900">Patient Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-gray-500">Name</label>
                                <p className="font-medium">{appointment.patientId.name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <p className="font-medium">{appointment.patientId.email}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Date & Time</label>
                                <p className="font-medium">
                                    {new Date(appointment.date).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Patient Notes</label>
                                <p className="bg-gray-50 p-3 rounded-md mt-1 text-gray-700">
                                    {appointment.notes || 'No notes provided.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Diagnosis Report */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-900">AI Diagnosis Report</h2>

                        {appointment.diagnosisId ? (
                            <div className="space-y-6">
                                <div className={`p-4 rounded-lg ${appointment.diagnosisId.aiAnalysis.severity === 'Emergency' ? 'bg-red-50 border border-red-200' :
                                    appointment.diagnosisId.aiAnalysis.severity === 'Severe' ? 'bg-orange-50 border border-orange-200' :
                                        'bg-blue-50 border border-blue-200'
                                    }`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700">Severity Assessment</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${appointment.diagnosisId.aiAnalysis.severity === 'Emergency' ? 'bg-red-200 text-red-800' :
                                            appointment.diagnosisId.aiAnalysis.severity === 'Severe' ? 'bg-orange-200 text-orange-800' :
                                                'bg-blue-200 text-blue-800'
                                            }`}>
                                            {appointment.diagnosisId.aiAnalysis.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {appointment.diagnosisId.aiAnalysis.doctor_report.urgency_level}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Clinical Summary</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {appointment.diagnosisId.aiAnalysis.doctor_report.clinical_summary}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Differential Diagnosis</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {appointment.diagnosisId.aiAnalysis.doctor_report.differential_diagnoses_reasoning}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Recommended Tests</h3>
                                    <ul className="list-disc pl-5 text-sm text-gray-700">
                                        {appointment.diagnosisId.aiAnalysis.doctor_report.recommended_tests.map((test, i) => (
                                            <li key={i}>{test}</li>
                                        ))}
                                    </ul>
                                </div>

                                {appointment.diagnosisId.aiAnalysis.doctor_report.red_flags.length > 0 && (
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                        <h3 className="font-semibold text-red-800 mb-2">Red Flags</h3>
                                        <ul className="list-disc pl-5 text-sm text-red-700">
                                            {appointment.diagnosisId.aiAnalysis.doctor_report.red_flags.map((flag, i) => (
                                                <li key={i}>{flag}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                No AI diagnosis report attached to this appointment.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
