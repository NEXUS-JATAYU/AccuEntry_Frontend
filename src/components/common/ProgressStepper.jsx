/* eslint-disable no-unused-vars */
import React from "react";

export default function DynamicProgressStepper({ mainSteps, missingFields, progress }) {
  // Calculate current step dynamically
  const stepEntries = Object.entries(mainSteps || {});
  const currentSub = missingFields?.[0]; // assume backend sends first missing field
  let currentMainIndex = 0;
  let currentSubIndex = 0;

  stepEntries.forEach(([main, subs], i) => {
    if (subs.includes(currentSub)) {
      currentMainIndex = i;
      currentSubIndex = subs.indexOf(currentSub);
    }
  });

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-3 shrink-0">
      {stepEntries.map(([main, subs], mainIdx) => (
        <div key={main} className="flex flex-col gap-1">
          {/* Main Step Label */}
          <div className={`text-sm font-semibold ${mainIdx <= currentMainIndex ? "text-citi-blue" : "text-gray-400"}`}>
            {main}
          </div>

          {/* Substeps */}
          <div className="flex gap-2 mt-1 flex-wrap">
            {subs.map((sub, subIdx) => {
              const isCompleted = mainIdx < currentMainIndex || (mainIdx === currentMainIndex && subIdx < currentSubIndex);
              const isCurrent = mainIdx === currentMainIndex && subIdx === currentSubIndex;

              return (
                <span
                  key={sub}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    isCompleted ? "bg-green-500 text-white border-green-500" :
                    isCurrent ? "bg-citi-blue text-white border-citi-blue" :
                    "bg-gray-200 text-gray-600 border-gray-300"
                  }`}
                >
                  {sub.replace(/_/g, " ")}
                </span>
              );
            })}
          </div>
        </div>
      ))}

      {/* Overall Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
        <div
          className="bg-citi-blue h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-sm font-semibold text-citi-dark-blue mt-1">
        <span>Step {currentMainIndex + 1}: {stepEntries[currentMainIndex]?.[0] || "Completed"}</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}