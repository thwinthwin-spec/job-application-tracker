import {
  EMPLOYMENT_TYPES,
  SORT_FIELDS,
  SORT_ORDERS,
  STATUSES,
} from '../utils/constants.js';

// Controlled filter controls. The page owns the values and receives changes.
export default function SearchFilterBar(props) {
  return (
    <section className="filter-panel" role="search" aria-label="Filter applications">
      <div className="filter-grid">
        <div className="form-field">
          <label htmlFor="filter-search">Search</label>
          <input
            id="filter-search"
            type="search"
            placeholder="Job title or company"
            value={props.search}
            onChange={function (event) { props.onSearchChange(event.target.value); }}
          />
        </div>

        <div className="form-field">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            value={props.status}
            onChange={function (event) { props.onStatusChange(event.target.value); }}
          >
            <option value="">All statuses</option>
            {STATUSES.map(function (status) {
              return <option value={status} key={status}>{status}</option>;
            })}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="filter-type">Employment type</label>
          <select
            id="filter-type"
            value={props.employmentType}
            onChange={function (event) { props.onEmploymentTypeChange(event.target.value); }}
          >
            <option value="">All types</option>
            {EMPLOYMENT_TYPES.map(function (type) {
              return <option value={type} key={type}>{type}</option>;
            })}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="filter-from">Applied from</label>
          <input
            id="filter-from"
            type="date"
            value={props.from}
            onChange={function (event) { props.onFromChange(event.target.value); }}
          />
        </div>

        <div className="form-field">
          <label htmlFor="filter-to">Applied to</label>
          <input
            id="filter-to"
            type="date"
            value={props.to}
            onChange={function (event) { props.onToChange(event.target.value); }}
          />
        </div>

        <div className="form-field">
          <label htmlFor="filter-sort">Sort by</label>
          <select
            id="filter-sort"
            value={props.sort}
            onChange={function (event) { props.onSortChange(event.target.value); }}
          >
            {SORT_FIELDS.map(function (field) {
              return <option value={field.value} key={field.value}>{field.label}</option>;
            })}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="filter-order">Order</label>
          <select
            id="filter-order"
            value={props.order}
            onChange={function (event) { props.onOrderChange(event.target.value); }}
          >
            {SORT_ORDERS.map(function (option) {
              return <option value={option.value} key={option.value}>{option.label}</option>;
            })}
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <p className="filter-count" aria-live="polite">
          {props.resultCount === undefined ? 'Loading results…' : String(props.resultCount) + ' found'}
        </p>
        <div className="filter-buttons">
          <button type="button" className="button button-ghost button-small" onClick={props.onReset}>
            Clear filters
          </button>
          <button
            type="button"
            className="button button-secondary button-small"
            onClick={props.onExport}
            disabled={props.exporting}
          >
            {props.exporting ? 'Preparing CSV…' : 'Export CSV'}
          </button>
        </div>
      </div>
    </section>
  );
}
