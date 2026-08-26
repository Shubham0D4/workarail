export function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'approved' || status === 'reimbursed' || status === 'paid'
      ? 'bg-[#0ca30c]/12 text-[#006300]'
      : status === 'rejected'
        ? 'bg-[#d03b3b]/12 text-[#b02c2c]'
        : 'bg-amber-100 text-amber-800'
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${tone}`}
    >
      {status}
    </span>
  )
}
