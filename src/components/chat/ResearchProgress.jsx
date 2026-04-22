'use client';

/**
 * ResearchProgress — ChatGPT-style collapsible research steps.
 *
 * Shows a vertical timeline of research phases (planning, searching,
 * reading, analyzing, writing) with animated icons and status indicators.
 */
import { useState } from 'react';

const phaseConfig = {
  INTAKE:             { icon: 'fa-lightbulb',          label: 'Understanding query',     color: 'text-yellow-400' },
  PLAN:               { icon: 'fa-compass-drafting',   label: 'Planning research',       color: 'text-yellow-300' },
  EVIDENCE_GATHERING: { icon: 'fa-magnifying-glass',   label: 'Gathering evidence',      color: 'text-blue-400' },
  ANALYSIS:           { icon: 'fa-flask',              label: 'Analyzing data',          color: 'text-cyan-400' },
  VERIFY:             { icon: 'fa-shield-check',       label: 'Verifying sources',       color: 'text-green-400' },
  SYNTHESIZE:         { icon: 'fa-chart-line',         label: 'Synthesizing findings',   color: 'text-purple-400' },
  CRITIC:             { icon: 'fa-clipboard-check',    label: 'Reviewing quality',       color: 'text-amber-400' },
  VALIDATE:           { icon: 'fa-circle-check',       label: 'Validating completeness', color: 'text-emerald-400' },
  FINALIZE:           { icon: 'fa-pen-to-square',      label: 'Writing final report',    color: 'text-brand-500' },
  TIMEOUT_FINALIZE:   { icon: 'fa-clock',              label: 'Wrapping up (time limit)', color: 'text-orange-400' },
  // Legacy keys
  SYNTHESIS:          { icon: 'fa-chart-line',         label: 'Synthesizing findings',   color: 'text-purple-400' },
  WRITING:            { icon: 'fa-pen-to-square',      label: 'Writing final report',    color: 'text-brand-500' },
  // lowercase fallbacks
  planning:  { icon: 'fa-compass-drafting', label: 'Planning research',  color: 'text-yellow-300' },
  searching: { icon: 'fa-magnifying-glass', label: 'Searching',          color: 'text-blue-400' },
  reading:   { icon: 'fa-book-open',        label: 'Reading sources',    color: 'text-green-400' },
  analyzing: { icon: 'fa-flask',            label: 'Analyzing',          color: 'text-cyan-400' },
  writing:   { icon: 'fa-pen-to-square',    label: 'Writing report',     color: 'text-brand-500' },
};

function getPhaseInfo(phase) {
  return phaseConfig[phase] || { icon: 'fa-circle-dot', label: phase || 'Working', color: 'text-gray-400' };
}

function StepDetail({ step }) {
  const primary = step.goal || step.query || step.text || step.message || null;
  const secondary = step.summary || step.url || step.source || null;

  if (!primary && !secondary) return null;

  return (
    <>
      {primary && <span>{primary}</span>}
      {secondary && primary && (
        <span className="block text-xs text-gray-500 mt-0.5">{secondary}</span>
      )}
      {secondary && !primary && <span>{secondary}</span>}
    </>
  );
}

export default function ResearchProgress({ steps }) {
  const [expanded, setExpanded] = useState(true);

  if (!steps || steps.length === 0) return null;

  const activeStep = steps.find(s => s.status === 'active');
  const completedCount = steps.filter(s => s.status === 'done').length;
  const activeInfo = activeStep ? getPhaseInfo(activeStep.phase) : null;

  return (
    <div className="mb-3">
      {/* Header — collapsible toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors cursor-pointer mb-2 group"
      >
        {activeStep ? (
          <span className={`inline-block animate-spin-slow ${activeInfo.color}`}>
            <i className="fa-solid fa-spinner"></i>
          </span>
        ) : (
          <span className="text-green-400">
            <i className="fa-solid fa-circle-check"></i>
          </span>
        )}
        <span className="truncate max-w-xs">
          {activeStep
            ? (activeStep.goal || activeStep.summary || `${activeInfo.label}...`)
            : `Research complete`
          }
        </span>
        <span className="text-gray-600 text-xs">
          {completedCount}/{steps.length} steps
        </span>
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Steps timeline */}
      {expanded && (
        <div className="ml-1 border-l-2 border-dark-600 pl-4 space-y-1">
          {steps.map((step, i) => {
            const info = getPhaseInfo(step.phase);
            const detail = StepDetail({ step });
            const isDone = step.status === 'done';
            const isActive = step.status === 'active';

            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 py-1 transition-opacity ${isDone ? 'opacity-60' : 'opacity-100'}`}
              >
                {/* Status icon */}
                <div className="flex-shrink-0 w-5 text-center -ml-[1.4rem]">
                  {isDone ? (
                    <i className="fa-solid fa-circle-check text-green-500 text-xs"></i>
                  ) : isActive ? (
                    <i className={`fa-solid ${info.icon} ${info.color} text-xs animate-pulse`}></i>
                  ) : (
                    <i className="fa-regular fa-circle text-gray-600 text-xs"></i>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {detail ? (
                    <>
                      <div className={`text-sm ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>
                        {detail}
                      </div>
                      {step.tool_used && (
                        <span className="text-xs text-gray-600">
                          ({step.tool_used})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className={`text-sm font-medium ${isActive ? info.color : 'text-gray-400'}`}>
                      {info.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
