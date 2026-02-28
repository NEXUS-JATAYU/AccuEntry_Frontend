import { useState } from 'react';
import Icon from '../common/Icon';

export default function LoginForm() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberUser, setRememberUser] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Sign on functionality is for demonstration purposes only.');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-50 border border-gray-200 rounded-lg p-5 w-full lg:max-w-xs lg:w-72 shadow-xl relative z-20"
        >
            <div className="flex flex-col gap-4 mb-4">
                <div>
                    <label htmlFor="userId" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                        User ID
                    </label>
                    <input
                        id="userId"
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="User ID"
                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-md bg-white focus:outline-none focus:border-citi-blue focus:ring-4 focus:ring-citi-blue/20 transition-all shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Password
                    </label>
                    <div className="relative flex items-center">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pl-3 pr-10 py-2.5 text-sm border-2 border-gray-200 rounded-md bg-white focus:outline-none focus:border-citi-blue focus:ring-4 focus:ring-citi-blue/20 transition-all shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center p-1"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <Icon name={showPassword ? 'eye-off' : 'eye'} className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <label className="flex items-center gap-2 mb-5 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={rememberUser}
                    onChange={(e) => setRememberUser(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-citi-blue focus:ring-citi-blue cursor-pointer"
                />
                <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Remember User ID</span>
            </label>

            <button
                type="submit"
                className="w-full py-2.5 text-sm font-bold tracking-wide text-white bg-citi-blue rounded-md hover:bg-citi-dark-blue transition-colors cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
                Sign On
            </button>

            <div className="flex justify-between mt-4 text-xs font-medium">
                <div className="flex gap-1">
                    <a href="#" className="text-citi-blue hover:text-citi-dark-blue hover:underline transition-colors">Register</a>
                    <span className="text-gray-400">/</span>
                    <a href="#" className="text-citi-blue hover:text-citi-dark-blue hover:underline transition-colors">Activate</a>
                </div>
                <div className="flex gap-1">
                    <span className="text-gray-500">Forgot</span>
                    <a href="#" className="text-citi-blue hover:text-citi-dark-blue hover:underline transition-colors">User ID</a>
                    <span className="text-gray-400">or</span>
                    <a href="#" className="text-citi-blue hover:text-citi-dark-blue hover:underline transition-colors">Password</a>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-center gap-2 text-sm text-citi-blue font-semibold hover:text-citi-dark-blue transition-colors cursor-pointer group">
                <Icon name="fingerprint" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Passwordless Sign On</span>
            </div>
        </form>
    );
}
