// Build a short list of page numbers with markers for skipped ranges.
function getPageNumbers(current, total) {
  const result = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      result.push(i);
    }
    return result;
  }

  result.push(1);

  let start = current - 1;
  if (start < 2) {
    start = 2;
  }

  let end = current + 1;
  if (end > total - 1) {
    end = total - 1;
  }

  if (start > 2) {
    result.push('start-gap');
  }

  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  if (end < total - 1) {
    result.push('end-gap');
  }

  result.push(total);
  return result;
}

// Page controls that work with the mouse and the keyboard.
export default function Pagination(props) {
  const page = props.page || 1;
  const pages = props.pages || 0;
  const total = props.total || 0;
  const limit = props.limit || 10;

  if (pages === 0) {
    return null;
  }

  const firstItem = (page - 1) * limit + 1;
  let lastItem = page * limit;
  if (lastItem > total) {
    lastItem = total;
  }

  const numbers = getPageNumbers(page, pages);

  return (
    <nav className="pagination" aria-label="Application list pages">
      <p className="pagination-summary">Showing {firstItem}–{lastItem} of {total}</p>

      <ul className="pagination-list">
        <li>
          <button
            type="button"
            className="page-button"
            onClick={function () { props.onPageChange(page - 1); }}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            Previous
          </button>
        </li>

        {numbers.map(function (value, index) {
          if (value === 'start-gap' || value === 'end-gap') {
            return <li key={value + index}><span className="page-gap" aria-hidden="true">…</span></li>;
          }

          const isCurrent = value === page;
          return (
            <li key={'page-' + value}>
              <button
                type="button"
                className={isCurrent ? 'page-button current' : 'page-button'}
                onClick={function () { props.onPageChange(value); }}
                aria-current={isCurrent ? 'page' : null}
                aria-label={'Go to page ' + value}
              >
                {value}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            className="page-button"
            onClick={function () { props.onPageChange(page + 1); }}
            disabled={page >= pages}
            aria-label="Next page"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
