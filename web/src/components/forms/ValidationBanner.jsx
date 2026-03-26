export default function ValidationBanner({ show = false, message = 'This form cannot be saved yet. Complete the required fields highlighted below.' }) {
  if (!show) return null;
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300 mb-4">
      {message}
    </div>
  );
}
