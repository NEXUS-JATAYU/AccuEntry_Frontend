import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const VERIFICATION_STORAGE_KEY = 'nexus-human-verified';

export default function VerificationPage() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const isVerified = sessionStorage.getItem(VERIFICATION_STORAGE_KEY) === 'true';

  if (isVerified) {
    return <Navigate to="/" replace />;
  }

  const handleContinue = () => {
    if (!checked) return;
    sessionStorage.setItem(VERIFICATION_STORAGE_KEY, 'true');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="px-6 py-5 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-citi-blue tracking-tight">nexus</h1>
      </header>

      <main className="min-h-[calc(100vh-77px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <p className="text-lg font-semibold text-gray-900 mb-4">Verification Required</p>
          <p className="text-sm text-gray-600 mb-6">
            Please complete the verification step to continue to the Nexus website.
          </p>

          <div className="flex items-center justify-between gap-4 border border-gray-300 rounded-md p-4 bg-gray-50">
            <label className="flex items-center gap-3 text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                className="h-5 w-5 accent-citi-blue cursor-pointer"
              />
              <span className="text-base">I am not a robot</span>
            </label>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-700">reCAPTCHA</div>
              <div className="text-[10px] text-gray-500">dummy verification</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!checked}
            className="mt-6 w-full h-11 rounded-md bg-citi-blue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition cursor-pointer"
          >
            Continue to Nexus
          </button>
        </div>
      </main>
    </div>
  );
}