/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";

const ONBOARDING_STEPS = [
  { step: 1, name: "Detail Capture", icon: "📋" },
  { step: 2, name: "Identity Verification", icon: "🪪" },
  { step: 3, name: "AML Screening", icon: "🔍" },
  { step: 4, name: "Fraud Check", icon: "🛡️" },
];

const stageLabels = {
  data_capture: "Step 1: Detail capture",
  doc_verification: "Step 2: Document verification",
  kyc_approval: "Step 3: KYC review",
  aml_screening: "Step 4: AML screening",
  fraud_check: "Step 5: Fraud check",
  complete: "Complete — account approved",
  rejected: "Application rejected",
};

const MOCK_START_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Welcome to AccuEntry! I'm here to help you open a new account. Whether you're interested in a Checking Account, Savings Account, or Credit Card, I'll guide you through the process step by step.\n\nWhat type of account would you like to open today?",
};

// ─── Step Tracker Component ───────────────────────────────────
function StepTracker({ currentStep, progress, barLabel }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
      {/* Step Circles */}
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto">
        {ONBOARDING_STEPS.map((s, idx) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;
          const isFuture = s.step > currentStep;

          return (
            <div key={s.step} className="flex items-center flex-1 last:flex-none">
              {/* Circle + Label */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-500 ease-in-out shrink-0 relative
                    ${isCompleted
                      ? "bg-green-500 text-white shadow-md shadow-green-200"
                      : isActive
                        ? "bg-citi-blue text-white shadow-lg shadow-citi-blue/30 ring-4 ring-citi-blue/20"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{s.icon}</span>
                  )}
                  {/* Pulse animation for active step */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-citi-blue/30 animate-ping" style={{ animationDuration: '2s' }} />
                  )}
                </div>
                <span
                  className={`
                    text-[11px] mt-1.5 font-medium text-center whitespace-nowrap
                    transition-colors duration-300
                    ${isCompleted
                      ? "text-green-600"
                      : isActive
                        ? "text-citi-dark-blue font-semibold"
                        : "text-gray-400"
                    }
                  `}
                >
                  {s.name}
                </span>
              </div>

              {/* Connector Line */}
              {idx < ONBOARDING_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5 relative overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="absolute inset-y-0 left-0 bg-green-500 transition-all duration-700 ease-in-out rounded-full"
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-semibold text-citi-dark-blue">
            {barLabel}
          </span>
          <span className="text-gray-500 font-medium">{progress}% Completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${progress}%`,
              background: progress >= 100
                ? "linear-gradient(90deg, #22c55e, #16a34a)"
                : "linear-gradient(90deg, #056dae, #0891b2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Chat Window ─────────────────────────────────────────
export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([MOCK_START_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [stage, setStage] = useState("data_capture");
  const [requiresUpload, setRequiresUpload] = useState(false);
  const [docStatus, setDocStatus] = useState({
    pan: null,
    aadhaar: null,
    selfie: null,
  });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const BACKEND_URL =
    import.meta.env.BACKEND_FASTAPI_URL || "http://localhost:8000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const uploadDoc = async (field, endpoint, file) => {
    if (!file) return;
    setDocStatus((prev) => ({ ...prev, [field]: "uploading" }));
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);
    try {
      const resp = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      setDocStatus((prev) => ({
        ...prev,
        [field]: data.verified ? "verified" : "failed",
      }));
    } catch {
      setDocStatus((prev) => ({ ...prev, [field]: "failed" }));
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { id: Date.now().toString(), role: "user", text },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_input: text,
        }),
      });

      const data = await response.json();
      console.log("API RESPONSE:", data);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: data.message,
        },
      ]);

      if (data.progress !== undefined) {
        setProgress(data.progress);
      }
      if (data.step !== undefined) {
        setCurrentStep(data.step);
      }
      if (data.stage) {
        setStage(data.stage);
      }
      if (data.requires_upload !== undefined) {
        setRequiresUpload(data.requires_upload);
      }
    } catch (error) {
      console.error("Chat error:", error);
    }

    setIsLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        text: `📎 Uploaded: ${file.name}`,
      },
    ]);

    try {
      // Determine endpoint based on file context
      const resp = await fetch(`${BACKEND_URL}/kyc/pan`, {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      console.log("Upload response:", data);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: data.verified
            ? "Document verified successfully!"
            : `Verification failed: ${data.error || "Unknown error"}`,
        },
      ]);
    } catch (err) {
      console.error("Upload error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "Failed to upload document. Please try again.",
        },
      ]);
    }

    setIsLoading(false);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-gray-50 shadow-inner">
      {/* Step Tracker + Progress Bar */}
      <StepTracker
        currentStep={currentStep}
        progress={progress}
        barLabel={stageLabels[stage] ?? stageLabels.data_capture}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-10 h-10 rounded-full bg-citi-blue text-white flex items-center justify-center text-sm font-bold shrink-0 mr-3 mt-1 shadow-md">
                  C
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 text-[15px] leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm ${
                  isUser
                    ? "bg-citi-blue text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-900 rounded-bl-sm"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold tracking-wide text-citi-blue">
                      AccuEntry Assistant
                    </span>
                  </div>
                )}
                {message.text}
              </div>
            </div>
          );
        })}

        {messages.filter((m) => m.role === "user").length === 0 && (
          <div className="flex flex-wrap gap-3 pl-14">
            <button
              onClick={() => sendMessage("I want to open a Checking Account")}
              className="px-5 py-2.5 text-sm font-semibold border-2 border-citi-blue text-citi-blue rounded-full hover:bg-citi-light-blue transition-colors shadow-sm bg-white"
            >
              Checking Account
            </button>
            <button
              onClick={() => sendMessage("I want to open a Savings Account")}
              className="px-5 py-2.5 text-sm font-semibold border-2 border-citi-blue text-citi-blue rounded-full hover:bg-citi-light-blue transition-colors shadow-sm bg-white"
            >
              Savings Account
            </button>
            <button
              onClick={() => sendMessage("I want to apply for a Credit Card")}
              className="px-5 py-2.5 text-sm font-semibold border-2 border-citi-blue text-citi-blue rounded-full hover:bg-citi-light-blue transition-colors shadow-sm bg-white"
            >
              Credit Card
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-10 h-10 rounded-full bg-citi-blue text-white flex items-center justify-center text-sm font-bold shrink-0 mr-3 shadow-md">
              C
            </div>
            <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-[56px]">
              <span
                className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-8 py-5 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        {!requiresUpload ? (
          <form onSubmit={handleSubmit} className="flex gap-3 w-full items-center">
            {/* File Upload Button (visible during identity verification) */}
            {currentStep === 2 && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="p-3 rounded-full bg-gray-100 hover:bg-citi-light-blue text-citi-blue transition-colors disabled:opacity-50 shrink-0"
                  title="Upload document (PDF, PNG, JPEG)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 text-[15px] border-2 border-gray-200 rounded-full bg-gray-50 text-gray-900 focus:outline-none focus:border-citi-blue focus:ring-2 focus:ring-citi-blue/20 focus:bg-white transition-all disabled:opacity-50 shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-8 py-3.5 text-[15px] font-bold tracking-wide text-white bg-citi-blue rounded-full transition-colors hover:bg-citi-dark-blue disabled:opacity-50 shadow-md hover:shadow-lg active:scale-[0.98] shrink-0"
            >
              Send Message
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            <p className="text-sm text-gray-600 font-medium">
              Upload each document below. We verify automatically after you choose a file.
            </p>
            {[
              { key: "pan", label: "PAN Card", endpoint: "/kyc/pan", disabled: false },
              { key: "aadhaar", label: "Aadhaar Card", endpoint: "/kyc/aadhaar", disabled: false },
              {
                key: "selfie",
                label: "Selfie",
                endpoint: "/kyc/selfie",
                disabled: docStatus.aadhaar !== "verified",
              },
            ].map(({ key, label, endpoint, disabled }) => {
              const st = docStatus[key];
              return (
                <div
                  key={key}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-3 bg-citi-light-blue/20 focus-within:border-citi-blue focus-within:ring-2 focus-within:ring-citi-blue/20 transition-colors ${
                    disabled ? "opacity-60" : ""
                  }`}
                >
                  <label className="text-sm font-semibold text-citi-dark-blue shrink-0 sm:w-36">
                    {label}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={disabled || isLoading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadDoc(key, endpoint, f);
                      e.target.value = "";
                    }}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-citi-blue file:text-white hover:file:bg-citi-dark-blue file:cursor-pointer disabled:opacity-50 file:shadow-sm"
                  />
                  <span className="text-sm sm:ml-auto sm:text-right min-h-[1.25rem] shrink-0">
                    {st === "uploading" && (
                      <span className="text-citi-blue font-medium">Checking...</span>
                    )}
                    {st === "verified" && (
                      <span className="text-green-600 font-semibold">Verified</span>
                    )}
                    {st === "failed" && (
                      <span className="text-red-600 font-semibold">Failed — retry</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
