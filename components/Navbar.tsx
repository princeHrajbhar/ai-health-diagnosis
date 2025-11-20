'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, Activity, User, LogOut } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Activity className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">AI Health</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Home
                            </Link>
                            {session && (
                                <>
                                    <Link href="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                        Dashboard
                                    </Link>
                                    {session.user.role === 'patient' && (
                                        <Link href="/diagnose" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                            Diagnose
                                        </Link>
                                    )}
                                    <Link href={session.user.role === 'doctor' ? '/doctor/dashboard' : '/appointments'} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                        Appointments
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">Hello, {session.user.name}</span>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <LogOut className="h-6 w-6" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Log in
                                </Link>
                                <Link href="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link href="/" className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                            Home
                        </Link>
                        {session && (
                            <>
                                <Link href="/dashboard" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                    Dashboard
                                </Link>
                                {session.user.role === 'patient' && (
                                    <Link href="/diagnose" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                        Diagnose
                                    </Link>
                                )}
                                <Link href={session.user.role === 'doctor' ? '/doctor/dashboard' : '/appointments'} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                    Appointments
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {session ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <User className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-600" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{session.user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <LogOut className="h-6 w-6" />
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-1 px-2">
                                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
                                    Log in
                                </Link>
                                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
