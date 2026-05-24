/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionIcon = ({ type, active, completed }) => {
  const variants = {
    inactive: { scale: 0.9, opacity: 0.7 },
    active: { scale: 1.15, opacity: 1 },
    completed: { scale: 1, opacity: 1 },
  };

  const transition = { type: "spring", stiffness: 400, damping: 15 };

  const iconProps = {
    className: "w-4 h-4",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    variants,
    initial: "inactive",
    animate: completed ? "completed" : active ? "active" : "inactive",
    transition
  };

  switch (type) {
    case "clipboard":
      return (
        <motion.svg {...iconProps}>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          {active && <motion.path d="M9 14h6M9 18h6M9 10h.01" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />}
        </motion.svg>
      );
    case "id-card":
      return (
        <motion.svg {...iconProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
          <path d="M8 10v.01"></path>
          <path d="M12 10h4"></path>
          <path d="M12 14h4"></path>
          {active && <motion.circle cx="8" cy="10" r="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} />}
        </motion.svg>
      );
    case "search":
      return (
        <motion.svg {...iconProps}>
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          {active && <motion.circle cx="11" cy="11" r="4" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.5 }} transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }} />}
        </motion.svg>
      );
    case "shield":
      return (
        <motion.svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          {active && <motion.path d="M9 12l2 2 4-4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />}
        </motion.svg>
      );
    case "check":
      return (
        <motion.svg {...iconProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </motion.svg>
      );
    default:
      return null;
  }
};

const ONBOARDING_STEPS = [
  { step: 1, name: "Detail Capture", type: "clipboard" },
  { step: 2, name: "Identity Verification", type: "id-card" },
  { step: 3, name: "AML Screening", type: "search" },
  { step: 4, name: "Fraud Check", type: "shield" },
  { step: 5, name: "Account Activation", type: "check" },
];

const stageLabels = {
  data_capture: "Step 1: Detail capture",
  doc_verification: "Step 2: Document verification",
  kyc_approval: "Step 3: KYC review",
  aml_screening: "Step 3: AML screening",
  fraud_check: "Step 4: Fraud check",
  manual_review: "Step 5: Manual review",
  pending_docs: "Step 5: Pending documents",
  escalated: "Step 5: Compliance escalation",
  otp_verification: "Step 5: Account activation",
  complete: "Step 5: Account activated",
  rejected: "Application rejected",
};

const STAGE_PROGRESS_FLOOR = {
  data_capture: 0,
  doc_verification: 40,
  kyc_approval: 65,
  aml_screening: 70,
  fraud_check: 80,
  decision_agent: 85,
  manual_review: 85,
  pending_docs: 85,
  escalated: 85,
  otp_verification: 95,
  complete: 100,
  rejected: 100,
};

const STAGE_TO_STEP = {
  data_capture: 1,
  doc_verification: 2,
  kyc_approval: 3,
  aml_screening: 3,
  fraud_check: 4,
  manual_review: 5,
  pending_docs: 5,
  escalated: 5,
  otp_verification: 5,
  complete: 5,
  rejected: 5,
};

const resolveProgressFromBackend = (data) => {
  const stage = data?.stage;
  const apiProgress = Number.isFinite(Number(data?.progress)) ? Number(data.progress) : 0;
  if (stage === "complete" || stage === "rejected") return 100;
  const floor = STAGE_PROGRESS_FLOOR[stage];
  if (floor != null) return Math.min(100, Math.max(apiProgress, floor));
  return Math.min(100, Math.max(0, apiProgress));
};

const resolveStepFromBackend = (data) => {
  if (data?.step !== undefined && data?.step !== null) {
    const step = Number(data.step);
    if (Number.isFinite(step) && step >= 1) return step;
  }
  return STAGE_TO_STEP[data?.stage] ?? 1;
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

const EDIT_DETAILS_FIELDS = [
  { key: "account_type", label: "Account Type", type: "select", options: ["Savings", "Current", "Fixed Deposit", "Recurring Deposit"] },
  { key: "full_name", label: "Full Name", type: "text" },
  { key: "dob", label: "Date of Birth", type: "date" },
  { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Third Gender"] },
  { key: "marital_status", label: "Marital Status", type: "select", options: ["Married", "Unmarried", "Others"] },
  { key: "pan_number", label: "PAN Number", type: "text" },
  { key: "nationality", label: "Indian Resident", type: "select", options: ["Yes", "No"] },
  { key: "occupation_type", label: "Occupation", type: "select", options: ["Pvt. Sector", "Govt", "Business", "Student", "Retired", "Other"] },
  { key: "annual_income", label: "Annual Income", type: "text" },
  { key: "source_of_funds", label: "Source of Funds", type: "select", options: ["Salary", "Business Income", "Agriculture", "Investment", "Pension", "Others"] },
  { key: "politically_exposed", label: "Politically Exposed", type: "select", options: ["Yes", "No", "Related to one"] },
  { key: "mobile_number", label: "Mobile Number", type: "text" },
  { key: "email_id", label: "Email", type: "email" },
  { key: "id_proof_type", label: "ID Proof Type", type: "select", options: ["Passport", "Voter ID", "Driving Licence", "Aadhaar", "NREGA Job Card"] },
  { key: "id_proof_number", label: "ID Proof Number", type: "text" },
  { key: "address", label: "Address", type: "textarea" },
  { key: "mode_of_operation", label: "Mode of Operation", type: "select", options: ["Self", "Either or Survivor", "Former or Survivor", "Jointly Operated"] },
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

const getStructuredMessageType = (text) => {
  try {
    const parsed = JSON.parse(text);
    return parsed?.type || null;
  } catch {
    return null;
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
    review: {
      label: "AML: Review",
      className: "bg-orange-100 text-orange-700 border border-orange-200",
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
    <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
      {/* Step Circles */}
      <div className="flex items-center justify-between mb-3 max-w-2xl mx-auto">
        {ONBOARDING_STEPS.map((s, idx) => {
          const isFlowComplete = progress >= 100;
          const isCompleted = isFlowComplete ? s.step <= ONBOARDING_STEPS.length : s.step < currentStep;
          const isActive = !isFlowComplete && s.step === currentStep;
          const isFuture = s.step > currentStep;

          return (
            <div key={s.step} className="flex items-center flex-1 last:flex-none">
              {/* Circle + Label */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all duration-500 ease-in-out shrink-0 relative
                    ${isCompleted
                      ? "bg-nexus-gold text-white shadow-md shadow-gold/30"
                      : isActive
                        ? "bg-nexus-navy text-white shadow-md shadow-navy/30 ring-2 ring-navy/20"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <motion.svg
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  ) : (
                    <MotionIcon type={s.type} active={isActive} completed={isCompleted} />
                  )}
                  {/* Pulse animation for active step */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-nexus-navy/30 animate-ping" style={{ animationDuration: '2s' }} />
                  )}
                </div>
                <span
                  className={`
                    text-[11px] mt-1.5 font-medium text-center whitespace-nowrap font-sans
                    transition-colors duration-300
                    ${isCompleted
                      ? "text-nexus-gold"
                      : isActive
                        ? "text-nexus-navy font-semibold"
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
                    className="absolute inset-y-0 left-0 bg-nexus-gold transition-all duration-700 ease-in-out rounded-full"
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
          <span className="font-semibold text-nexus-navy font-display tracking-wide">
            {barLabel}
          </span>
          <span className="text-gray-500 font-sans font-medium">{progress}% Completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-navy)",
            }}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${amlBadge.className}`}>
            {amlBadge.label}
          </span>
        </div>
        {(amlInBackground || amlStatus === "clear" || amlStatus === "flagged" || amlStatus === "review") && (
          <div className="mt-2 grid gap-1">
            {AML_CHECKS.map((item) => {
              const status = amlChecks[item.key] || "idle";
              return (
                <div key={item.key} className="flex items-center justify-between text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
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

        {(stage === "fraud_check" || stage === "manual_review" || stage === "pending_docs" || stage === "escalated" || stage === "complete" || fraudStatus) && (
          <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-semibold text-citi-dark-blue">Fraud Check Pipeline</span>
              <span className="text-gray-600">
                {fraudStatus ? `Status: ${fraudStatus}` : "Status: running"}
                {fraudRiskScore !== null && fraudRiskScore !== undefined ? ` | Risk ${fraudRiskScore}` : ""}
              </span>
            </div>
            <div className="grid gap-1">
              {FRAUD_LAYERS.map((label) => (
                <div key={label} className="flex items-center justify-between text-[11px] bg-white border border-gray-200 rounded-md px-2 py-1.5">
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

// ─── Live KYC Video Modal ──────────────────────────────────────
function LiveKycModal({ isOpen, onClose, sessionId, backendUrl, onComplete }) {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    setStream((prev) => {
      const active = prev || streamRef.current;
      if (active) {
        active.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      return null;
    });
  }, []);

  const startCamera = useCallback(async () => {
    if (streamRef.current) {
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = s;
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setErrorMsg("");
      setVideoBlob(null);
      setTimeLeft(3);
    } catch (err) {
      setErrorMsg("Camera access denied or unavailable.");
    }
  }, []);

  useEffect(() => {
    let startTimer = null;
    if (isOpen) {
      startTimer = window.setTimeout(() => {
        void startCamera();
      }, 0);
    } else {
      startTimer = window.setTimeout(() => {
        stopCamera();
      }, 0);
    }

    return () => {
      if (startTimer !== null) {
        window.clearTimeout(startTimer);
      }
    };
  }, [isOpen, startCamera, stopCamera]);

  // Ensure stream stays bound to videoRef even after React re-renders or unmounts.
  useEffect(() => {
    if (videoRef.current && stream && !videoBlob) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoBlob]);

  const startRecording = () => {
    if (!stream) return;
    setRecording(true);
    setVideoBlob(null);
    const options = { mimeType: 'video/webm' };
    const recorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = recorder;
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoBlob(blob);
      setRecording(false);
    };

    recorder.start();

    let t = 3;
    setTimeLeft(t);
    const timer = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(timer);
        recorder.stop();
      }
    }, 1000);
  };

  const handleUpload = async () => {
    if (!videoBlob) return;
    setUploading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", videoBlob, "live_kyc.webm");

    try {
      const resp = await fetch(`${backendUrl}/kyc/video-kyc`, {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      if (data.verified) {
        onComplete(true, null);
        onClose();
      } else {
        onComplete(false, data.error || "Verification failed");
        onClose();
      }
    } catch (err) {
      setErrorMsg("Upload failed. Try again.");
    }
    setUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Live KYC Video</h3>
          <button onClick={onClose} disabled={uploading || recording} className="text-gray-500 hover:text-gray-800 transition-colors">
            ✕
          </button>
        </div>
        <div className="p-5 flex flex-col items-center">
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative shadow-inner">
            {!videoBlob && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!stream ? "hidden" : ""}`}
              />
            )}
            {videoBlob && (
              <video
                src={URL.createObjectURL(videoBlob)}
                autoPlay
                controls
                className="w-full h-full object-cover"
              />
            )}
            {!stream && !videoBlob && !errorMsg && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">Loading camera...</div>
            )}
            {errorMsg && (
              <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-red-50/90 text-sm font-semibold p-4 text-center">
                {errorMsg}
              </div>
            )}
            {recording && (
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse shadow-md">
                <span className="w-2 h-2 rounded-full bg-white" />
                Recording: {timeLeft}s
              </div>
            )}
          </div>
          
          <div className="mt-6 flex flex-col w-full gap-3">
            {!videoBlob ? (
               <button
                 onClick={startRecording}
                 disabled={!stream || recording}
                 className="w-full py-3.5 bg-citi-blue text-white rounded-xl font-bold hover:bg-citi-dark-blue transition-colors disabled:opacity-50 shadow-md active:scale-95 flex items-center justify-center gap-2"
               >
                 {recording ? "Recording..." : "Start 3s Recording"}
               </button>
            ) : (
               <div className="flex gap-3">
                 <button
                   onClick={() => setVideoBlob(null)}
                   disabled={uploading}
                   className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 active:scale-95"
                 >
                   Retake
                 </button>
                 <button
                   onClick={handleUpload}
                   disabled={uploading}
                   className="flex-1 py-3 text-white bg-green-600 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md active:scale-95 flex items-center justify-center"
                 >
                   {uploading ? (
                     <span className="animate-pulse">Uploading...</span>
                   ) : (
                     "Submit Video"
                   )}
                 </button>
               </div>
            )}
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center max-w-xs leading-relaxed">
             Please face the camera and move your head slightly. We need a 3s live video to match with your selfie.
          </p>
        </div>
      </div>
    </div>
  );
}

function EditDetailsModal({
  isOpen,
  onClose,
  fields,
  formData,
  onFieldChange,
  onSave,
  loading,
  saving,
  errors,
  loadError,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-nexus-navy/40 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-nexus-navy tracking-wide">Edit Captured Details</h3>
              <button 
                onClick={onClose} 
                disabled={saving} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-nexus-navy transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {loadError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {loadError}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-nexus-navy/20 border-t-nexus-navy rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {fields.map((field) => {
                    const value = formData[field.key] ?? "";
                    const error = errors[field.key];
                    const inputClasses = "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[15px] font-sans focus:bg-white focus:outline-none focus:border-nexus-navy focus:ring-4 focus:ring-nexus-gold/20 transition-all";

                    return (
                      <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                        <label className="block text-sm font-semibold text-nexus-navy mb-1.5 font-sans">
                          {field.label}
                        </label>

                        {field.type === "select" ? (
                          <select
                            value={value}
                            onChange={(e) => onFieldChange(field.key, e.target.value)}
                            className={inputClasses}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            rows={3}
                            value={value}
                            onChange={(e) => onFieldChange(field.key, e.target.value)}
                            className={inputClasses}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={value}
                            onChange={(e) => onFieldChange(field.key, e.target.value)}
                            className={inputClasses}
                          />
                        )}

                        {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold font-sans hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={loading || saving}
                className="px-8 py-2.5 rounded-full bg-nexus-navy text-white font-bold font-sans tracking-wide hover:bg-nexus-gold transition-colors disabled:opacity-50 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : "Save Details"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [sessionEnded, setSessionEnded] = useState(false);
  const [fraudStatus, setFraudStatus] = useState(null);
  const [fraudRiskScore, setFraudRiskScore] = useState(null);
  const [fraudSignals, setFraudSignals] = useState([]);
  const [fraudReasoning, setFraudReasoning] = useState(null);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["" , "", "", ""]);
  const otpRefs = useRef([]);
  const [amlChecks, setAmlChecks] = useState({
    sanctions: "idle",
    rbi: "idle",
    pep: "idle",
    rules: "idle",
  });
  const amlTimelineRef = useRef(null);
  const amlPollInFlightRef = useRef(false);
  const docPollInFlightRef = useRef(false);
  const fraudPollInFlightRef = useRef(false);
  const prevAmlRef = useRef({ amlInBackground: false, amlStatus: "pending" });
  const fraudPromptRef = useRef({ announced: false, introShown: false, seenSignals: new Set() });
  const fraudReasoningRef = useRef("");
  const fraudIntroTimersRef = useRef([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isLiveKycOpen, setIsLiveKycOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [editDetailsLoading, setEditDetailsLoading] = useState(false);
  const [editDetailsSaving, setEditDetailsSaving] = useState(false);
  const [editDetailsError, setEditDetailsError] = useState("");
  const [editDetailsForm, setEditDetailsForm] = useState({});
  const [editDetailsFieldErrors, setEditDetailsFieldErrors] = useState({});
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_FASTAPI_URL ||
    import.meta.env.BACKEND_FASTAPI_URL ||
    "http://localhost:8000";
  const allDocsVerified = docStatus.pan === "verified" && docStatus.aadhaar === "verified" && docStatus.selfie === "verified";
  const showUploadPanel = requiresUpload && !allDocsVerified;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!amlInBackground) {
      if (amlStatus === "clear" || amlStatus === "flagged" || amlStatus === "review") {
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
    // Keep AML status stateful, but avoid injecting synthetic AML completion
    // chat messages that can conflict with backend-driven stage updates.
    prevAmlRef.current = { amlInBackground, amlStatus };
  }, [amlInBackground, amlStatus]);

  const applyBackendState = useCallback((data, options = {}) => {
    const { appendAssistantMessage = true } = options;

    const holdForAml = Boolean(data?.aml_in_background) && data?.stage === "complete";
    if (appendAssistantMessage && data?.message && !holdForAml) {
      setMessages((prev) => {
        const incomingType = getStructuredMessageType(data.message);

        // For OTP prompts, keep only one latest assistant OTP card to avoid chat spam.
        if (incomingType === "OTP_REQUESTED") {
          const withoutOldOtpCards = prev.filter(
            (msg) => !(msg.role === "assistant" && getStructuredMessageType(msg.text) === "OTP_REQUESTED")
          );
          return [
            ...withoutOldOtpCards,
            {
              id: Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9),
              role: "assistant",
              text: data.message,
            },
          ];
        }

        // Check if message already exists (not just the last one) to prevent duplicates
        const messageExists = prev.some(msg => msg.role === "assistant" && msg.text === data.message);
        if (messageExists) {
          return prev;
        }
        return [
          ...prev,
          {
            id: Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9),
            role: "assistant",
            text: data.message,
          },
        ];
      });
    }
    if (data?.stage) setStage(data.stage);
    if (data?.session_ended !== undefined) setSessionEnded(Boolean(data.session_ended));
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
    if (data?.otp_required !== undefined) {
      setOtpRequired(Boolean(data.otp_required));
    }

    const resolvedProgress = resolveProgressFromBackend(data);
    const resolvedStep = resolveStepFromBackend(data);

    const inBg = data?.aml_in_background !== undefined ? Boolean(data.aml_in_background) : amlInBackground;
    if (inBg) {
      setProgress(Math.max(65, Math.min(resolvedProgress, 80)));
      setCurrentStep(3);
      return;
    }

    setProgress(resolvedProgress);
    setCurrentStep(resolvedStep);
  }, [amlInBackground]);

  useEffect(() => {
    if (sessionEnded) return undefined;

    let cancelled = false;
    const syncSession = async () => {
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
        if (!cancelled) {
          applyBackendState(data, { appendAssistantMessage: false });
        }
      } catch (err) {
        console.error("Session progress sync error:", err);
      }
    };

    syncSession();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- sync once per session id
  }, [sessionId, sessionEnded, BACKEND_URL]);

  useEffect(() => {
    if (!amlInBackground || stage === "otp_verification" || stage === "complete" || sessionEnded) return undefined;

    const poll = async () => {
      if (amlPollInFlightRef.current) return;
      amlPollInFlightRef.current = true;
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
        console.error("AML status poll error:", err);
      } finally {
        amlPollInFlightRef.current = false;
      }
    };

    poll();
    const timer = setInterval(poll, 4000);
    return () => clearInterval(timer);
  }, [amlInBackground, stage, sessionEnded, BACKEND_URL, sessionId, applyBackendState]);

  useEffect(() => {
    if (stage !== "doc_verification" || sessionEnded) return undefined;

    const poll = async () => {
      if (docPollInFlightRef.current) return;
      docPollInFlightRef.current = true;
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
        console.error("Doc verification poll error:", err);
      } finally {
        docPollInFlightRef.current = false;
      }
    };

    poll();
    const timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, [stage, sessionEnded, BACKEND_URL, sessionId, applyBackendState]);

  useEffect(() => {
    if (stage !== "fraud_check" || progress >= 100 || sessionEnded) return undefined;

    const poll = async () => {
      if (fraudPollInFlightRef.current) return;
      fraudPollInFlightRef.current = true;
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
        console.error("Fraud status poll error:", err);
      } finally {
        fraudPollInFlightRef.current = false;
      }
    };

    poll();
    const timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, [stage, progress, sessionEnded, BACKEND_URL, sessionId, applyBackendState]);

  const uploadDoc = async (field, endpoint, file) => {
    if (!file || sessionEnded) return;
    setDocStatus((prev) => ({ ...prev, [field]: "uploading" }));
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);
    try {
      const resp = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });
      let data = {};
      try {
        data = await resp.json();
      } catch {
        data = {};
      }
      if (!resp.ok) {
        const detail = data?.detail;
        const msg = typeof detail === "string" ? detail : detail?.message || `HTTP ${resp.status}`;
        console.error("Upload error:", msg);
        setDocStatus((prev) => ({ ...prev, [field]: "failed" }));
        return;
      }
      setDocStatus((prev) => ({
        ...prev,
        [field]: data.verified ? "verified" : "failed",
      }));
      if (!data.verified && data.error) {
        console.warn(`Verify ${field} failed:`, data.error, data.checks || {});
      }
    } catch (err) {
      console.error("Upload network error:", err);
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
    if (!text.trim() || isLoading || sessionEnded) return;

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

  const handleLiveKycComplete = async (success, errorMsg) => {
    if (success) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          text: `Live Video Verification Successful: **Verified**.\n\nYour identity has been securely confirmed and matches your government ID.`
        }
      ]);
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
        console.error("Live KYC poll error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      let readableError = errorMsg;
      if (errorMsg === "blur_detected") readableError = "The video is too blurry. Please hold the camera steadily.";
      else if (errorMsg === "low_light_detected") readableError = "Lighting is too dim. Please move to a brighter area.";
      else if (errorMsg === "overexposed_detected") readableError = "Lighting is too bright. Please avoid strong backlight.";
      else if (errorMsg === "static_video_rejected") readableError = "No motion detected. Please slightly move your head backwards and forwards.";
      else if (errorMsg === "spoofing_detected") readableError = "Biometric check failed! Please ensure a live person is clearly visible on camera.";
      else if (errorMsg === "frame_extraction_failed") readableError = "Video processing failed. Please try again.";
      else if (errorMsg === "selfie_not_uploaded" || errorMsg === "selfie_image_missing") readableError = "Could not locate your previously uploaded selfie to compare.";
      else if (errorMsg === "invalid_image") readableError = "Extracted video frame was corrupted.";
      else if (errorMsg === "Verification failed") readableError = "Identity comparison against your uploaded Selfie resulted in a low match score.";
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          text: JSON.stringify({
            type: "LIVE_KYC_REQUESTED",
            payload: {
              message: `Live Video Verification Failed: Not Verified.\n\nReason: ${readableError}\n\nPlease tap the button below to try recording again.`
            }
          })
        }
      ]);
    }
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

  const openEditDetailsModal = async () => {
    setIsEditDetailsOpen(true);
    setEditDetailsLoading(true);
    setEditDetailsError("");
    setEditDetailsFieldErrors({});

    try {
      const resp = await fetch(`${BACKEND_URL}/session/${sessionId}/details`);
      const data = await resp.json();
      setEditDetailsForm(data.details || {});
    } catch (err) {
      setEditDetailsError("Unable to load captured details. Please try again.");
    } finally {
      setEditDetailsLoading(false);
    }
  };

  const saveEditedDetails = async () => {
    setEditDetailsSaving(true);
    setEditDetailsError("");
    setEditDetailsFieldErrors({});

    try {
      const resp = await fetch(`${BACKEND_URL}/session/${sessionId}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          details: editDetailsForm,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setEditDetailsError(data?.detail || "Failed to update details.");
        return;
      }

      if (data?.errors && Object.keys(data.errors).length > 0) {
        setEditDetailsFieldErrors(data.errors);
        setEditDetailsError(data.message || "Validation failed. Please correct highlighted fields.");
        return;
      }

      setEditDetailsForm(data.details || editDetailsForm);
      setIsEditDetailsOpen(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-edit-details-saved`,
          role: "assistant",
          text: "Your details were updated successfully and saved to our records. Please continue with identity verification.",
        },
      ]);

      // Immediately trigger one backend turn so stage/progress/requires_upload
      // move forward and doc verification upload UI appears again.
      setIsLoading(true);
      try {
        const nextResp = await fetch(`${BACKEND_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            user_input: "",
          }),
        });
        const nextData = await nextResp.json();
        applyBackendState(nextData, { appendAssistantMessage: true });
      } catch (pollErr) {
        console.error("Post-save flow resume error:", pollErr);
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      setEditDetailsError("Failed to save details. Please try again.");
    } finally {
      setEditDetailsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fcfdfd] relative">
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
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 flex flex-col gap-5">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-10 h-10 rounded-full bg-nexus-navy text-nexus-gold flex items-center justify-center text-sm font-bold shrink-0 mr-3 mt-1 shadow-md border-2 border-nexus-gold/20">
                    A
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 text-[15px] leading-relaxed whitespace-pre-wrap font-sans shadow-md ${
                    isUser
                      ? "bg-nexus-navy text-white rounded-2xl rounded-tr-sm"
                      : "bg-white text-nexus-navy rounded-2xl rounded-tl-sm border border-gray-100"
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold tracking-wider text-nexus-gold uppercase">
                        AccuEntry AI
                      </span>
                    </div>
                  )}
                  {(() => {
                  try {
                    const data = JSON.parse(message.text);
                    if (data && data.type === "OTP_REQUESTED") {
                      const { message: otpMsg } = data.payload;
                      return (
                        <div className="flex flex-col gap-3">
                          <p className="whitespace-pre-wrap">{otpMsg}</p>
                          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                            <p className="text-sm text-indigo-700 font-medium">
                              📧 Check your email for the 4-digit code
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Code expires in 10 minutes
                            </p>
                          </div>
                        </div>
                      );
                    }
                    if (data && data.type === "ACCOUNT_ACTIVATED") {
                      const { message: actMsg, account, activatedAt } = data.payload;
                      return (
                        <div className="flex flex-col gap-3">
                          <p className="whitespace-pre-wrap text-lg font-semibold">{actMsg}</p>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3 border-b border-green-200 pb-2">
                              <span className="text-green-800 font-bold">Account Details</span>
                              <span className="bg-green-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                                ACTIVE
                              </span>
                            </div>
                            <div className="grid grid-cols-[110px_1fr] gap-y-2 text-[13px]">
                              <div className="text-green-700 font-medium">Account ID:</div>
                              <div className="font-mono text-gray-900">{account?.accountId}</div>
                              <div className="text-green-700 font-medium">Name:</div>
                              <div className="font-medium text-gray-900">{account?.accountHolderName}</div>
                              <div className="text-green-700 font-medium">Account Type:</div>
                              <div className="font-medium text-gray-900">{account?.accountType}</div>
                              <div className="text-green-700 font-medium">Activated On:</div>
                              <div className="font-medium text-gray-900">
                                {activatedAt ? (() => {
                                  try {
                                    const dateObj = new Date(activatedAt);
                                    const timestamp = dateObj.getTime();
                                    if (timestamp > 0) {
                                      return dateObj.toLocaleString();
                                    }
                                    return activatedAt;
                                  } catch (e) {
                                    return activatedAt;
                                  }
                                })() : `[ERROR: activatedAt is ${activatedAt}]`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    if (data && data.type === "ACCOUNT_ACTIVATION_SUCCESS") {
                      const { message: actMsg, account, nextSteps } = data.payload;
                      return (
                        <div className="flex flex-col gap-3">
                          <p>{actMsg}</p>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3 border-b border-green-200 pb-2">
                              <span className="text-green-800 font-bold">Account Details</span>
                              <span className="bg-green-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                                {account.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-[110px_1fr] gap-y-2 text-[13px]">
                              <div className="text-green-700 font-medium">Account ID:</div>
                              <div className="font-mono text-gray-900">{account.accountId}</div>
                              <div className="text-green-700 font-medium">Name:</div>
                              <div className="font-medium text-gray-900">{account.accountHolderName}</div>
                              <div className="text-green-700 font-medium">Account Type:</div>
                              <div className="font-medium text-gray-900">{account.accountType}</div>
                              <div className="text-green-700 font-medium">Features:</div>
                              <div className="font-medium text-gray-900">{account.features?.join(", ")}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{nextSteps}</p>
                        </div>
                      );
                    }
                    if (data && data.type === "LIVE_KYC_REQUESTED") {
                      const { message: kycMsg } = data.payload;
                      return (
                        <div className="flex flex-col gap-4 mt-1">
                          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{kycMsg}</p>
                          <button
                            onClick={() => setIsLiveKycOpen(true)}
                            className="bg-nexus-navy text-white font-bold font-sans tracking-wide py-2.5 px-8 rounded-full hover:bg-nexus-gold transition-colors shadow-md hover:shadow-lg active:scale-95 self-start flex items-center gap-3"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            <span>Start Live KYC Video</span>
                          </button>
                        </div>
                      );
                    }
                    if (data && data.type === "DETAILS_CONFIRMATION_REQUIRED") {
                      const { message: detailsMsg, buttonLabel } = data.payload;
                      return (
                        <div className="flex flex-col gap-4 mt-1">
                          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{detailsMsg}</p>
                          <button
                            onClick={openEditDetailsModal}
                            className="bg-nexus-navy text-white font-bold font-sans tracking-wide py-2.5 px-8 rounded-full hover:bg-nexus-gold transition-colors shadow-md hover:shadow-lg active:scale-95 self-start flex items-center gap-2"
                          >
                            <span>{buttonLabel || "VIEW DETAILS"}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </div>
                      );
                    }
                  } catch (e) {
                    // Not a structured message, render normally
                  }
                  return message.text;
                })()}
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex justify-start"
          >
            <div className="w-10 h-10 rounded-full bg-nexus-navy text-nexus-gold flex items-center justify-center text-sm font-bold shrink-0 mr-3 mt-1 shadow-md border-2 border-nexus-gold/20">
              A
            </div>
            <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-md flex items-center gap-2 h-[56px]">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 bg-nexus-navy/40 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-8 py-5 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        {otpRequired && !requiresUpload ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const code = otpDigits.join("");
              if (code.length === 4) {
                sendMessage(code);
                setOtpDigits(["", "", "", ""]);
              }
            }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <p className="text-sm font-medium text-gray-700">Enter your 4-digit activation code</p>
            <div className="flex gap-3">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`OTP digit ${idx + 1}`}
                  value={digit}
                  disabled={isLoading || sessionEnded}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    setOtpDigits((prev) => {
                      const next = [...prev];
                      next[idx] = val;
                      return next;
                    });
                    if (val && idx < 3) otpRefs.current[idx + 1]?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && idx > 0) {
                      otpRefs.current[idx - 1]?.focus();
                    }
                  }}
                  className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={isLoading || sessionEnded || otpDigits.join("").length !== 4}
              className="px-8 py-3.5 text-[15px] font-bold tracking-wide text-white bg-nexus-navy rounded-full transition-colors hover:bg-nexus-gold disabled:opacity-50 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Verify & Activate
            </button>
            <button
              type="button"
              disabled={isLoading || sessionEnded}
              onClick={() => sendMessage("resend code")}
              className="px-8 py-3 text-[14px] font-semibold tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full transition-colors hover:bg-indigo-100 disabled:opacity-50"
            >
              Resend Code
            </button>
          </form>
        ) : !showUploadPanel ? (
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
                  aria-label="Upload document"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || sessionEnded}
                  className="p-3 rounded-full bg-gray-100 hover:bg-citi-light-blue text-citi-blue transition-colors disabled:opacity-50 shrink-0"
                  title="Upload document (PDF, PNG, JPEG)"
                  aria-label="Upload document button"
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
              disabled={isLoading || sessionEnded}
              aria-label="Chat input"
              className="flex-1 px-6 py-3.5 text-[15px] font-sans border border-gray-200 rounded-full bg-white text-nexus-navy focus:outline-none focus:border-nexus-navy focus:ring-4 focus:ring-nexus-gold/20 transition-all disabled:opacity-50 shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || sessionEnded || !input.trim()}
              className="px-8 py-3.5 text-[15px] font-bold font-sans tracking-wide text-white bg-nexus-navy rounded-full transition-colors hover:bg-nexus-gold disabled:opacity-50 shadow-md hover:shadow-lg active:scale-[0.98] shrink-0"
            >
              Send Message
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-2.5 mb-1">
              <svg className="w-5 h-5 text-nexus-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="text-sm text-nexus-navy font-semibold font-sans tracking-wide">
                Upload documents for verification
              </p>
            </div>
            {[
              {
                key: "pan",
                label: "PAN Card",
                endpoint: "/kyc/pan",
                disabled: false,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
                ),
              },
              {
                key: "aadhaar",
                label: "Aadhaar Card",
                endpoint: "/kyc/aadhaar",
                disabled: false,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                ),
              },
              {
                key: "selfie",
                label: "Selfie",
                endpoint: "/kyc/selfie",
                disabled: docStatus.aadhaar !== "verified",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                ),
              },
            ].map(({ key, label, endpoint, disabled, icon }) => {
              const st = docStatus[key];
              const isVerified = st === "verified";
              const isFailed = st === "failed";
              const isUploading = st === "uploading";
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`relative flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-200 ${
                    isVerified
                      ? "border-emerald-300 bg-emerald-50/60"
                      : isFailed
                      ? "border-red-300 bg-red-50/60"
                      : disabled
                      ? "border-gray-200 bg-gray-50/40 opacity-50 cursor-not-allowed"
                      : "border-gray-200 bg-white hover:border-nexus-gold/50 hover:shadow-md"
                  }`}
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    isVerified
                      ? "bg-emerald-100 text-emerald-600"
                      : isFailed
                      ? "bg-red-100 text-red-500"
                      : "bg-nexus-navy/5 text-nexus-navy"
                  }`}>
                    {icon}
                  </div>

                  {/* Label + Status */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-semibold font-sans text-nexus-navy tracking-wide">{label}</span>
                    <span className="text-xs mt-0.5">
                      {isUploading && (
                        <span className="text-nexus-gold font-medium flex items-center gap-1">
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          Verifying...
                        </span>
                      )}
                      {isVerified && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          Verified
                        </span>
                      )}
                      {isFailed && (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                          Failed — tap to retry
                        </span>
                      )}
                      {!isUploading && !isVerified && !isFailed && (
                        <span className="text-gray-400">
                          {disabled ? "Unlock after Aadhaar" : "Tap to upload"}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Upload Button */}
                  <label className={`shrink-0 cursor-pointer ${(disabled || isLoading) ? "pointer-events-none opacity-40" : ""}`}>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={disabled || isLoading}
                      aria-label={`Upload ${label}`}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadDoc(key, endpoint, f);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                    <span className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold font-sans tracking-wide rounded-full transition-all shadow-sm ${
                      isVerified
                        ? "bg-emerald-500 text-white"
                        : "bg-nexus-navy text-white hover:bg-nexus-gold hover:shadow-md"
                    }`}>
                      {isVerified ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          Done
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          Upload
                        </>
                      )}
                    </span>
                  </label>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <LiveKycModal 
        isOpen={isLiveKycOpen} 
        onClose={() => setIsLiveKycOpen(false)} 
        sessionId={sessionId} 
        backendUrl={BACKEND_URL} 
        onComplete={handleLiveKycComplete} 
      />

      <EditDetailsModal
        isOpen={isEditDetailsOpen}
        onClose={() => setIsEditDetailsOpen(false)}
        fields={EDIT_DETAILS_FIELDS}
        formData={editDetailsForm}
        onFieldChange={(key, value) => {
          setEditDetailsForm((prev) => ({ ...prev, [key]: value }));
          setEditDetailsFieldErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        }}
        onSave={saveEditedDetails}
        loading={editDetailsLoading}
        saving={editDetailsSaving}
        errors={editDetailsFieldErrors}
        loadError={editDetailsError}
      />
    </div>
  );
}
