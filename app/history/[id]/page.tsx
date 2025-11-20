'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DiagnosisData {
    _id: string;
    createdAt: string;
    symptoms: string;
    aiAnalysis: {
        summary: string;
        differential_diagnoses: {
            disease_name: string;
            confidence_percent: number;
            key_supporting_symptoms: string[];
            suggested_tests: string[];
        }[];
        severity: 'Normal' | 'Moderate' | 'Severe' | 'Emergency';
        reason_for_classification: string;
        patient_advice: {
            steps: string[];
            monitoring: string[];
            home_care: string[];
            warning_signs: string[];
        };
    };
}

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const [record, setRecord] = useState<DiagnosisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            console.log('Fetching history record for ID:', id);
            fetch(`/api/history/${id}`)
                .then((res) => {
                    console.log('API Response status:', res.status);
                    if (!res.ok) throw new Error('Failed to fetch record');
                    return res.json();
                })
                .then((data) => {
                    console.log('Record data received:', data);
                    setRecord(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error loading history:', err);
                    setError('Could not load diagnosis details.');
                    setLoading(false);
                });
        }
    }, [session, id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">{error}</div>;
    if (!record) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Record not found</div>;

    const { aiAnalysis } = record;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="text-indigo-600 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                    <span className="text-gray-500 text-sm">
                        {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className={`p-6 rounded-xl shadow-lg text-white ${aiAnalysis.severity === 'Emergency' ? 'bg-red-600' :
                    aiAnalysis.severity === 'Severe' ? 'bg-orange-500' :
                        aiAnalysis.severity === 'Moderate' ? 'bg-yellow-500' :
                            'bg-green-500'
                    }`}>
                    <h1 className="text-3xl font-bold mb-2 text-white">Severity: {aiAnalysis.severity}</h1>
                    <p className="text-lg opacity-90 text-white">{aiAnalysis.reason_for_classification}</p>
                    {aiAnalysis.severity === 'Emergency' && (
                        <div className="mt-4 bg-white text-red-600 p-4 rounded-lg font-bold text-center text-xl">
                            ⚠ THIS IS AN EMERGENCY. GO TO THE NEAREST ER IMMEDIATELY.
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Your Symptoms</h2>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{record.symptoms}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Analysis Summary</h2>
                    <p className="text-gray-700">{aiAnalysis.summary}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Potential Causes</h2>
                    <div className="space-y-4">
                        {aiAnalysis.differential_diagnoses.map((diagnosis, idx) => (
                            <div key={idx} className="border-b pb-4 last:border-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-lg text-gray-900">{diagnosis.disease_name}</h3>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {diagnosis.confidence_percent}% Match
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Supporting Symptoms:</strong> {diagnosis.key_supporting_symptoms.join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">What to do next</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {aiAnalysis.patient_advice.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ul>
                </div>

                {(aiAnalysis.severity === 'Severe' || aiAnalysis.severity === 'Emergency') && (
                    <div className="flex justify-center pt-4">
                        <Link
                            href={`/appointments/book/select?diagnosisId=${record._id}`}
                            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg transition transform hover:scale-105"
                        >
                            Book an Appointment with a Specialist
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
