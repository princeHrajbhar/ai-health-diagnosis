'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Diagnosis {
    _id: string;
    createdAt: string;
    symptoms: string;
    aiAnalysis: {
        severity: string;
        summary: string;
    };
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [history, setHistory] = useState<Diagnosis[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetch('/api/history')
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setHistory(data);
                    }
                });
        }
    }, [session]);

    if (status === 'loading') return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, {session?.user?.name}
                    </h1>
                    <Link
                        href="/diagnose"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                    >
                        Start New Diagnosis
                    </Link>
                </header>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Recent Health History
                    </h2>

                    {history.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
                            No health records found. Start a new diagnosis to get started.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {history.map((record) => (
                                <div
                                    key={record._id}
                                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-sm text-gray-500">
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${record.aiAnalysis.severity === 'Normal'
                                                    ? 'bg-green-100 text-green-800'
                                                    : record.aiAnalysis.severity === 'Moderate'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : record.aiAnalysis.severity === 'Severe'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {record.aiAnalysis.severity}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                                        {record.symptoms}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {record.aiAnalysis.summary}
                                    </p>
                                    <Link
                                        href={`/history/${record._id}`}
                                        className="mt-4 inline-block text-indigo-600 text-sm hover:underline"
                                    >
                                        View Full Report
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
