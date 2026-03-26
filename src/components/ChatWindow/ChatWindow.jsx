/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";

const ONBOARDING_STEPS = [
  { step: 1, name: "Detail Capture", icon: "📋" },
  { step: 2, name: "Identity Verification", icon: "🪪" },
  { step: 3, name: "AML Screening", icon: "🔍" },
  { step: 4, name: "Fraud Check", icon: "🛡️" },
  { step: 5, name: "Account Activation", icon: "✅" },
];

const stageLabels = {
  data_capture: "Step 1: Detail capture",
  doc_verification: "Step 2: Document verification",
  kyc_approval: "Step 3: KYC review",
  aml_screening: "Step 3: AML screening",
  fraud_check: "Step 4: Fraud check",
  manual_review: "Step 4: Manual review",
  complete: "Step 5: Account activated",
  rejected: "Application rejected",
};

const FRAUD_LAYERS = [
  "Rule checks",
  "Behavioural signals",
  "Identity cross-match",
  "Risk reasoning",
];

const AML_CHECKS = [
  { key: "sanctions", label: "Sanctions list" },
  { key: "rbi", label: "RBI caution list" },
  { key: "pep", label: "PEP screening" },
  { key: "rules", label: "Risk rules" },
];

const splitFraudSignal = (signal) => {
  const raw = String(signal || "").trim();
  const idx = raw.indexOf(":");
  if (idx === -1) return { key: raw, value: "" };
  return { key: raw.slice(0, idx), value: raw.slice(idx + 1) };
};

const prettifyKey = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatFraudSignalLabel = (signal) => {
  const { key, value } = splitFraudSignal(signal);
  const show = (label) => (value ? `${label} (${value})` : label);

  switch (key) {
    case "missing_email": return "Missing email";
    case "invalid_email_format": return show("Invalid email format");
    case "disposable_email_domain": return show("Disposable email domain");
    case "missing_phone": return "Missing phone number";
    case "invalid_phone_number": return show("Invalid phone number");
    case "unparseable_phone": return "Unparseable phone";
    case "risky_phone_type": return show("Risky phone type");
    case "ip_blocklisted": return show("IP blocklisted");
    case "ip_private_range": return "Private range IP";
    case "high_velocity_ip": return show("High IP velocity");
    case "moderate_velocity_ip": return show("Moderate IP velocity");
    case "device_flag": return show("Device risk flag");
    case "suspiciously_fast_form_fill": return show("Unusually fast form fill");
    case "low_keystroke_entropy": return show("Low keystroke entropy");
    case "name_low_similarity": return show("Low name similarity");
    case "name_partial_similarity": return show("Partial name similarity");
    case "dob_mismatch_vs_document": return "DOB mismatch against document";
    case "dob_unparseable": return "DOB parsing issue";
    case "address_low_overlap": return show("Low address overlap");
    default: return value ? `${prettifyKey(key)} (${value})` : prettifyKey(key);
  }
};

const formatFraudSignalChatDetail = (signal) => {
  const { key, value } = splitFraudSignal(signal);

  switch (key) {
    case "missing_email": return "Email field was missing.";
    case "invalid_email_format": return `Email format validation failed${value ? ` (${value})` : ""}.`;
    case "disposable_email_domain": return `Disposable email domain detected${value ? ` (${value})` : ""}.`;
    case "missing_phone": return "Phone number field was missing.";
    case "invalid_phone_number": return `Phone number validation failed${value ? ` (${value})` : ""}.`;
    case "unparseable_phone": return "Phone number could not be parsed reliably.";
    case "risky_phone_type": return `Phone type is marked risky${value ? ` (${value})` : ""}.`;
    case "ip_blocklisted": return `Network IP is listed in a blocklist${value ? ` (${value})` : ""}.`;
    case "ip_private_range": return "Network IP belongs to a private range.";
    case "high_velocity_ip": return `High sign-up velocity detected for this IP${value ? ` (${value})` : ""}.`;
    case "moderate_velocity_ip": return `Moderate sign-up velocity detected for this IP${value ? ` (${value})` : ""}.`;
    case "device_flag": return `Device fingerprint raised a risk flag${value ? ` (${value})` : ""}.`;
    case "suspiciously_fast_form_fill": return `Form completion speed looked suspiciously fast${value ? ` (${value})` : ""}.`;
    case "low_keystroke_entropy": return `Typing pattern entropy is lower than expected${value ? ` (${value})` : ""}.`;
    case "name_low_similarity": return `Name similarity against documents is low${value ? ` (${value})` : ""}.`;
    case "name_partial_similarity": return `Name similarity is partial${value ? ` (${value})` : ""}.`;
    case "dob_mismatch_vs_document": return "Date of birth does not match document data.";
    case "dob_unparseable": return "Date of birth could not be parsed reliably.";
    case "address_low_overlap": return `Address overlap against supporting data is low${value ? ` (${value})` : ""}.`;
    default: return `${formatFraudSignalLabel(signal)} was flagged.`;
  }
};

const MOCK_START_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Welcome to AccuEntry! I will guide you through the process step by step.\n\nHere are common account types and why people choose them:\n- Savings Account: for everyday saving and earning interest.\n- Current Account: for frequent transactions, usually for business use.\n- Fixed Deposit: for parking money for a fixed period to earn higher returns.\n- Recurring Deposit: for monthly saving discipline with fixed deposits over time.\n\nWhat type of account would you like to open today?",
};

// ─── Step Tracker Component ───────────────────────────────────
function StepTracker({ currentStep, progress, barLabel, stage, amlStatus, amlInBackground, amlChecks, fraudStatus, fraudRiskScore, fraudSignals }) {
  const normalizedAml = amlInBackground ? "checking" : (amlStatus || "pending");

  const amlBadge = {
    checking: {
      label: "AML: Checking",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
    },
    clear: {
      label: "AML: Clear",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    flagged: {
      label: "AML: Flagged",
      className: "bg-red-100 text-red-700 border border-red-200",
    },
    pending: {
      label: "AML: Pending",
      className: "bg-gray-100 text-gray-600 border border-gray-200",
    },
  }[normalizedAml] || {
    label: "AML: Pending",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  };

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
        <div className="mt-3 flex justify-end">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${amlBadge.className}`}>
            {amlBadge.label}
          </span>
        </div>
        {(amlInBackground || amlStatus === "clear" || amlStatus === "flagged") && (
          <div className="mt-3 grid gap-2">
            {AML_CHECKS.map((item) => {
              const status = amlChecks[item.key] || "idle";
              return (
                <div key={item.key} className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="inline-flex items-center gap-2">
                    {status === "checking" && (
                      <span className="inline-flex items-center gap-2 text-amber-700 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Checking
                      </span>
                    )}
                    {status === "done" && (
                      <span className="inline-flex items-center gap-2 text-green-700 font-semibold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Done
                      </span>
                    )}
                    {status === "idle" && <span className="text-gray-500">Queued</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {(stage === "fraud_check" || stage === "manual_review" || stage === "complete" || fraudStatus) && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-citi-dark-blue">Fraud Check Pipeline</span>
              <span className="text-gray-600">
                {fraudStatus ? `Status: ${fraudStatus}` : "Status: running"}
                {fraudRiskScore !== null && fraudRiskScore !== undefined ? ` | Risk ${fraudRiskScore}` : ""}
              </span>
            </div>
            <div className="grid gap-2">
              {FRAUD_LAYERS.map((label) => (
                <div key={label} className="flex items-center justify-between text-xs bg-white border border-gray-200 rounded-md px-3 py-2">
                  <span className="font-medium text-gray-700">{label}</span>
                  {(stage === "fraud_check" && !fraudStatus) ? (
                    <span className="inline-flex items-center gap-2 text-amber-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Checking
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-green-700 font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Done
                    </span>
                  )}
                </div>
              ))}
            </div>
            {Array.isArray(fraudSignals) && fraudSignals.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {fraudSignals.slice(0, 3).map((signal) => (
                  <span key={signal} className="inline-flex items-center rounded-full bg-white border border-gray-300 px-2.5 py-1 text-[11px] text-gray-700">
                    {formatFraudSignalLabel(signal)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
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
  const [amlStatus, setAmlStatus] = useState("pending");
  const [amlInBackground, setAmlInBackground] = useState(false);
  const [fraudStatus, setFraudStatus] = useState(null);
  const [fraudRiskScore, setFraudRiskScore] = useState(null);
  const [fraudSignals, setFraudSignals] = useState([]);
  const [fraudReasoning, setFraudReasoning] = useState(null);
  const [amlChecks, setAmlChecks] = useState({
    sanctions: "idle",
    rbi: "idle",
    pep: "idle",
    rules: "idle",
  });
  const amlTimelineRef = useRef(null);
  const prevAmlRef = useRef({ amlInBackground: false, amlStatus: "pending" });
  const fraudPromptRef = useRef({ announced: false, introShown: false, seenSignals: new Set() });
  const fraudReasoningRef = useRef("");
  const fraudIntroTimersRef = useRef([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const BACKEND_URL =
    import.meta.env.BACKEND_FASTAPI_URL || "http://localhost:8000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!amlInBackground) {
      if (amlStatus === "clear" || amlStatus === "flagged") {
        setAmlChecks({
          sanctions: "done",
          rbi: "done",
          pep: "done",
          rules: "done",
        });
      }
      if (amlTimelineRef.current) {
        clearInterval(amlTimelineRef.current);
        amlTimelineRef.current = null;
      }
      return undefined;
    }

    const keys = AML_CHECKS.map((c) => c.key);
    let idx = 0;

    setAmlChecks({ sanctions: "checking", rbi: "idle", pep: "idle", rules: "idle" });
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-aml-start`,
        role: "assistant",
        text: "AML started: checking sanctions list...",
      },
    ]);

    amlTimelineRef.current = setInterval(() => {
      setAmlChecks((prev) => {
        const next = { ...prev };
        const currentKey = keys[idx];
        if (currentKey) next[currentKey] = "done";
        idx += 1;
        const nextKey = keys[idx];
        if (nextKey) next[nextKey] = "checking";
        return next;
      });

      if (idx < keys.length) {
        const label = AML_CHECKS[idx].label.toLowerCase();
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-aml-${idx}`,
            role: "assistant",
            text: `AML update: checking ${label}...`,
          },
        ]);
      }

      if (idx >= keys.length) {
        clearInterval(amlTimelineRef.current);
        amlTimelineRef.current = null;
      }
    }, 1800);

    return () => {
      if (amlTimelineRef.current) {
        clearInterval(amlTimelineRef.current);
        amlTimelineRef.current = null;
      }
    };
  }, [amlInBackground, amlStatus]);

  useEffect(() => {
    if (stage !== "fraud_check") {
      fraudIntroTimersRef.current.forEach((t) => clearTimeout(t));
      fraudIntroTimersRef.current = [];
      fraudPromptRef.current = { announced: false, introShown: false, seenSignals: new Set() };
      fraudReasoningRef.current = "";
      return;
    }

    if (!fraudPromptRef.current.announced && !fraudPromptRef.current.introShown) {
      const staged = [
        "Fraud screening started. We are now checking network and IP reputation.",
        "We are validating email and phone authenticity.",
        "We are evaluating device and behavior anomalies.",
        "We are cross-checking identity consistency across captured data.",
      ];

      staged.forEach((line, idx) => {
        const timer = setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-fraud-stage-${idx}`,
              role: "assistant",
              text: line,
            },
          ]);
        }, idx * 900);
        fraudIntroTimersRef.current.push(timer);
      });

      fraudPromptRef.current.introShown = true;
      fraudPromptRef.current.announced = true;
    }

    const seen = fraudPromptRef.current.seenSignals;
    const incoming = Array.isArray(fraudSignals) ? fraudSignals : [];
    incoming.forEach((signal) => {
      if (seen.has(signal)) return;
      seen.add(signal);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-fraud-signal-${signal}`,
          role: "assistant",
          text: `Fraud check update: ${formatFraudSignalChatDetail(signal)}`,
        },
      ]);
    });

    if (fraudReasoning && fraudReasoning !== fraudReasoningRef.current) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-fraud-insight`,
          role: "assistant",
          text: `Fraud model insight: ${fraudReasoning}`,
        },
      ]);
      fraudReasoningRef.current = fraudReasoning;
    }
  }, [stage, fraudSignals, fraudRiskScore, fraudStatus, fraudReasoning]);

  useEffect(() => {
    const prev = prevAmlRef.current;
    if (prev.amlInBackground && !amlInBackground) {
      if (amlStatus === "clear") {
        setMessages((old) => [
          ...old,
          {
            id: `${Date.now()}-aml-clear`,
            role: "assistant",
            text: "AML screening complete: all checks cleared.",
          },
        ]);
      }
      if (amlStatus === "flagged") {
        setMessages((old) => [
          ...old,
          {
            id: `${Date.now()}-aml-flagged`,
            role: "assistant",
            text: "AML screening complete: application flagged for compliance review.",
          },
        ]);
      }
    }
    prevAmlRef.current = { amlInBackground, amlStatus };
  }, [amlInBackground, amlStatus]);

  const applyBackendState = (data, options = {}) => {
    const { appendAssistantMessage = true } = options;

    const holdForAml = Boolean(data?.aml_in_background) && data?.stage === "complete";
    if (appendAssistantMessage && data?.message && !holdForAml) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: data.message,
        },
      ]);
    }
    if (data?.stage) setStage(data.stage);
    if (data?.requires_upload !== undefined) setRequiresUpload(data.requires_upload);
    if (data?.aml_status !== undefined && data?.aml_status !== null) {
      setAmlStatus(data.aml_status);
    }
    if (data?.aml_in_background !== undefined) {
      setAmlInBackground(Boolean(data.aml_in_background));
    }
    if (data?.fraud_status !== undefined) {
      setFraudStatus(data.fraud_status);
    }
    if (data?.fraud_risk_score !== undefined) {
      setFraudRiskScore(data.fraud_risk_score);
    }
    if (Array.isArray(data?.fraud_signals)) {
      setFraudSignals(data.fraud_signals);
    }
    if (data?.fraud_reasoning !== undefined) {
      setFraudReasoning(data.fraud_reasoning);
    }

    const inBg = data?.aml_in_background !== undefined ? Boolean(data.aml_in_background) : amlInBackground;
    if (inBg) {
      setProgress((prev) => {
        const incoming = data?.progress !== undefined ? data.progress : prev;
        return Math.max(65, Math.min(incoming, 80));
      });
      setCurrentStep(3);
      return;
    }

    if (data?.progress !== undefined) setProgress(data.progress);
    if (data?.step !== undefined) setCurrentStep(data.step);
  };

  useEffect(() => {
    if (!amlInBackground) return undefined;

    const poll = async () => {
      try {
        const resp = await fetch(`${BACKEND_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            user_input: "",
          }),
        });
        const data = await resp.json();
        applyBackendState(data, { appendAssistantMessage: false });
      } catch (err) {
        console.error("AML status poll error:", err);
      }
    };

    const timer = setInterval(poll, 4000);
    return () => clearInterval(timer);
  }, [amlInBackground, BACKEND_URL, sessionId]);

  useEffect(() => {
    if (stage !== "fraud_check" || progress >= 100) return undefined;

    const poll = async () => {
      try {
        const resp = await fetch(`${BACKEND_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            user_input: "",
          }),
        });
        const data = await resp.json();
        applyBackendState(data, { appendAssistantMessage: false });
      } catch (err) {
        console.error("Fraud status poll error:", err);
      }
    };

    const timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, [stage, progress, BACKEND_URL, sessionId]);

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

    // After selfie is uploaded, immediately trigger a backend `/chat` turn
    // so the supervisor can poll verification status and advance progress.
    if (field === "selfie") {
      setIsLoading(true);
      try {
        const resp = await fetch(`${BACKEND_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            user_input: "",
          }),
        });
        const data = await resp.json();
        applyBackendState(data, { appendAssistantMessage: true });
      } catch (err) {
        console.error("Post-selfie chat poll error:", err);
      } finally {
        setIsLoading(false);
      }
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
      applyBackendState(data, { appendAssistantMessage: true });
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
        barLabel={amlInBackground ? stageLabels.aml_screening : (stageLabels[stage] ?? stageLabels.data_capture)}
        stage={stage}
        amlStatus={amlStatus}
        amlInBackground={amlInBackground}
        amlChecks={amlChecks}
        fraudStatus={fraudStatus}
        fraudRiskScore={fraudRiskScore}
        fraudSignals={fraudSignals}
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
