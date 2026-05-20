import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../common/Icon';

export default function LoginForm() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberUser, setRememberUser] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Sign on functionality is for demonstration purposes only.');
    };

    const isUserIdActive = focusedField === 'userId' || userId.length > 0;
    const isPasswordActive = focusedField === 'password' || password.length > 0;

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-2xl p-6 w-full lg:max-w-xs lg:w-80 shadow-xl shadow-gray-200/50 relative z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <div className="flex flex-col gap-5 mb-5">
                {/* User ID Field */}
                <div className="relative">
                    <motion.label
                        htmlFor="userId"
                        className="absolute left-2.5 px-1 text-gray-400 pointer-events-none origin-left z-10 bg-white"
                        animate={{
                            y: isUserIdActive ? -10 : 12,
                            scale: isUserIdActive ? 0.8 : 1,
                            color: isUserIdActive ? '#056dae' : '#9CA3AF',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{ top: 0 }}
                    >
                        User ID
                    </motion.label>
                    <input
                        id="userId"
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        onFocus={() => setFocusedField('userId')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 py-3.5 text-sm border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-citi-blue transition-all duration-200"
                    />
                </div>

                {/* Password Field */}
                <div className="relative">
                    <motion.label
                        htmlFor="password"
                        className="absolute left-2.5 px-1 text-gray-400 pointer-events-none origin-left z-10 bg-white"
                        animate={{
                            y: isPasswordActive ? -10 : 12,
                            scale: isPasswordActive ? 0.8 : 1,
                            color: isPasswordActive ? '#056dae' : '#9CA3AF',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{ top: 0 }}
                    >
                        Password
                    </motion.label>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-3 pr-10 py-3.5 text-sm border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-citi-blue transition-all duration-200"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        <Icon name={showPassword ? 'eye-off' : 'eye'} className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <label className="flex items-center gap-2.5 mb-5 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={rememberUser}
                    onChange={(e) => setRememberUser(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-citi-blue focus:ring-citi-blue cursor-pointer"
                />
                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">Remember User ID</span>
            </label>

            <motion.button
                type="submit"
                className="w-full py-3 text-sm font-bold tracking-wide text-white bg-citi-blue rounded-xl cursor-pointer shadow-md"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(5, 109, 174, 0.35)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
                Sign On
            </motion.button>

            <div className="flex justify-between mt-4 text-xs font-medium">
                <div className="flex gap-1">
                    <a href="#" className="text-citi-blue hover:text-citi-dark-blue transition-colors">Register</a>
                    <span className="text-gray-300">/</span>
                    <a href="#" className="text-citi-blue hover:text-citi-dark-blue transition-colors">Activate</a>
                </div>
                <div className="flex gap-1">
                    <span className="text-gray-400">Forgot</span>
                    <a href="#" className="text-citi-blue hover:text-citi-dark-blue transition-colors">User ID</a>
                    <span className="text-gray-300">or</span>
                    <a href="#" className="text-citi-blue hover:text-citi-dark-blue transition-colors">Password</a>
                </div>
            </div>

            {/* Passwordless CTA */}
            <motion.div
                className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm font-semibold text-citi-blue cursor-pointer group relative overflow-hidden rounded-lg py-2"
                whileHover={{ backgroundColor: 'rgba(5, 109, 174, 0.05)' }}
            >
                <Icon name="fingerprint" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Passwordless Sign On</span>
            </motion.div>
        </motion.form>
    );
}
