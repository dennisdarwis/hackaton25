import { useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';


export const Route = createFileRoute('/login')({
    component: RouteComponent,
})

function RouteComponent() {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            sessionStorage.setItem('username', username.trim());
            router.navigate({ to: '/' }); // Redirect to home or chat page
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 font-semibold hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default RouteComponent;
