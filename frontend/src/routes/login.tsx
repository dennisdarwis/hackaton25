import { useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { API_URL } from '@/commons/urls';


export const Route = createFileRoute('/login')({
    component: RouteComponent,
})

function RouteComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) return;
        setLoading(true);
        try {
            const accessToken = sessionStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(username ? { 'username': username } : {}),
                    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
                },
                body: JSON.stringify({ username: username.trim(), password: password.trim() }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Login failed');
            }
            const tokenData = await response.json();
            sessionStorage.setItem('username', username.trim());
            sessionStorage.setItem('access_token', tokenData.access_token);
            sessionStorage.setItem('token_type', tokenData.token_type);
            router.navigate({ to: '/' }); // Redirect to home or chat page
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                {error && <div className="text-red-500 text-center mb-2">{error}</div>}
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className={`bg-blue-500 text-white rounded px-4 py-2 font-semibold hover:bg-blue-600 transition ${(!username.trim() || !password.trim() || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!username.trim() || !password.trim() || loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default RouteComponent;
