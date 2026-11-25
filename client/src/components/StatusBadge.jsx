// Pick a color class for each status value.
function statusClass(status) {
  if (status === 'Saved') return 'badge-saved';
  if (status === 'Applied') return 'badge-applied';
  if (status === 'Interview') return 'badge-interview';
  if (status === 'Offer') return 'badge-offer';
  if (status === 'Rejected') return 'badge-rejected';
  if (status === 'Withdrawn') return 'badge-withdrawn';
  return 'badge-default';
}

// Show a status as a small colored pill.
export default function StatusBadge(props) {
  const status = props.status || 'Saved';

  return (
    <span className={'badge ' + statusClass(status)}>
      {status}
    </span>
  );
}
