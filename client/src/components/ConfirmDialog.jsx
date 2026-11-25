import { useEffect, useRef } from 'react';

// A keyboard-friendly confirmation dialog that can be cancelled.
export default function ConfirmDialog(props) {
  const cancelRef = useRef(null);

  // Focus the safe button and allow Escape to close the dialog.
  useEffect(function () {
    if (!props.open) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !props.busy) {
        props.onCancel();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    if (cancelRef.current) {
      cancelRef.current.focus();
    }

    return function () {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [props.open, props.busy, props.onCancel]);

  if (!props.open) {
    return null;
  }

  const title = props.title || 'Are you sure?';
  const message = props.message || 'This action cannot be undone.';
  const confirmLabel = props.confirmLabel || 'Confirm';

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget && !props.busy) {
      props.onCancel();
    }
  }

  return (
    <div className="dialog-backdrop" onMouseDown={handleBackdropClick}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <h2 id="confirm-dialog-title">{title}</h2>
        <p id="confirm-dialog-message">{message}</p>

        <div className="dialog-actions">
          <button
            type="button"
            ref={cancelRef}
            className="button button-ghost"
            onClick={props.onCancel}
            disabled={props.busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={props.onConfirm}
            disabled={props.busy}
          >
            {props.busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
