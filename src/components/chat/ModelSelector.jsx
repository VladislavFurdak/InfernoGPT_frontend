'use client';

/**
 * ModelSelector — Tab bar for switching between AI model versions.
 * Shows capacity status and disables unavailable modes.
 */
import { useChat } from '../../context/ChatContext';
import { useCapacity } from '../../context/CapacityContext';
import { MODELS } from '../../constants';

const MODE_MAP = { 'deep-research': 'deep', fast: 'fast' };

export default function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChat();
  const { capacity, anyAvailable } = useCapacity();

  return (
    <div className="border-b border-dark-700 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-md w-full z-10 hidden md:flex flex-shrink-0">
      <div className="h-14 flex items-center">
        <div className="bg-dark-800 rounded-lg p-1 flex border border-dark-700">
          {MODELS.map(model => {
            const modeKey = MODE_MAP[model.id] || model.id;
            const info = capacity[modeKey] || {};
            const isAvailable = info.available !== false;
            const isSelected = selectedModel === model.id;

            return (
              <button
                key={model.id}
                onClick={() => isAvailable && setSelectedModel(model.id)}
                disabled={!isAvailable}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  !isAvailable
                    ? 'text-gray-600 cursor-not-allowed'
                    : isSelected
                      ? 'bg-dark-600 text-white shadow-sm cursor-pointer'
                      : 'text-gray-400 hover:text-white cursor-pointer'
                }`}
              >
                {model.label}
                {info.max > 0 && (
                  <span className={`text-xs ${isAvailable ? 'text-gray-500' : 'text-red-400/70'}`}>
                    {info.active}/{info.max}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {!anyAvailable && (
        <div className="pb-2 text-xs text-red-400">
          All slots occupied. Try again shortly.
        </div>
      )}
    </div>
  );
}
