export default function FieldLabel({ label, required, children }) {
  return (
    <label className="block mb-1">
      <span className="text-sm font-medium text-slate-200">
        {label} {required && <span className="text-rose-400">*</span>}
      </span>
      {children}
    </label>
  );
}
