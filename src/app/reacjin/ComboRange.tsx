export function ComboRange({
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}) {
  // a text input and range input that edit the same value
  return (
    <div className="flex flex-row gap-2">
      <input
        className="flex-1"
        type="range"
        value={value}
        onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
        min={min}
        max={max}
        step={step}
      />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
