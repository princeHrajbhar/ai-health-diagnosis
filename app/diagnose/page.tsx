'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DiagnosisResult {
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
}

export default function DiagnosePage() {
    const { data: session } = useSession();
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/diagnose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symptoms,
                    userId: session?.user?.id,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to get diagnosis');
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className={`p-6 rounded-xl shadow-lg text-white ${result.severity === 'Emergency' ? 'bg-red-600' :
                        result.severity === 'Severe' ? 'bg-orange-500' :
                            result.severity === 'Moderate' ? 'bg-yellow-500' :
                                'bg-green-500'
                        }`}>
                        <h1 className="text-3xl font-bold mb-2">Severity: {result.severity}</h1>
                        <p className="text-lg opacity-90">{result.reason_for_classification}</p>
                        {result.severity === 'Emergency' && (
                            <div className="mt-4 bg-white text-red-600 p-4 rounded-lg font-bold text-center text-xl animate-pulse">
                                ⚠ THIS IS AN EMERGENCY. GO TO THE NEAREST ER IMMEDIATELY.
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Analysis Summary</h2>
                        <p className="text-gray-700">{result.summary}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Potential Causes</h2>
                        <div className="space-y-4">
                            {result.differential_diagnoses.map((diagnosis, idx) => (
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
                            {result.patient_advice.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                            ))}
                        </ul>
                    </div>

                    {(result.severity === 'Severe' || result.severity === 'Emergency') && (
                        <div className="flex justify-center pt-4">
                            <Link
                                href="/appointments" // We'll build this next
                                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg transition transform hover:scale-105"
                            >
                                Book an Appointment with a Specialist
                            </Link>
                        </div>
                    )}

                    <div className="text-center pt-8">
                        <button
                            onClick={() => setResult(null)}
                            className="text-gray-500 hover:text-gray-700 underline"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    AI Health Assistant
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Describe your symptoms in detail to get an instant analysis.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What are you feeling?
                        </label>
                        <textarea
                            required
                            rows={6}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900"
                            placeholder="E.g., I have a severe headache on the left side, sensitivity to light, and nausea since this morning..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg text-white font-bold text-lg transition ${loading
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                            }`}
                    >
                        {loading ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/dashboard" className="text-indigo-600 hover:underline">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
