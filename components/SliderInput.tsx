
import React from 'react';

interface SliderInputProps {
  label: string;
  emoji: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  color: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({ label, emoji, value, onChange, min = 1, max = 10, color }) => {
  const getBackgroundSize = () => {
    return { backgroundSize: `${((value - min) * 100) / (max - min)}% 100%` };
  };

  return (
    <div>
      <label className="flex items-center justify-between text-lg font-medium text-brand-dark mb-2">
        <span className="flex items-center">
          <span role="img" aria-label={label} className="mr-2 text-xl">{emoji}</span> {label}
        </span>
        <span className={`font-bold font-rounded text-xl ${color.replace('bg-', 'text-')}`}>{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider-thumb ${color}`}
        style={getBackgroundSize()}
      />
      <style>{`
        .slider-thumb {
          background-image: linear-gradient(to right, var(--slider-color), var(--slider-color));
          background-repeat: no-repeat;
        }
        .slider-thumb.bg-brand-green { --slider-color: #A8D8C9; background-color: #e0e0e0; }
        .slider-thumb.bg-brand-gold { --slider-color: #F4D35E; background-color: #e0e0e0; }
        .slider-thumb.bg-brand-blue { --slider-color: #4E8A9C; background-color: #e0e0e0; }
        
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 4px solid var(--slider-color);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          margin-top: -9px;
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 4px solid var(--slider-color);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
