import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exportApplications, fetchApplications } from '../api/applicationApi.js';
import { getErrorMessage } from '../api/axios.js';
import ApplicationTable from '../components/ApplicationTable.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Pagination from '../components/Pagination.jsx';
import SearchFilterBar from '../components/SearchFilterBar.jsx';
import { DEFAULT_PAGE_SIZE } from '../utils/constants.js';
import { buildCsvFilename } from '../utils/formatters.js';

export default function ApplicationListPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('dateApplied');
  const [order, setOrder] = useState('desc');

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  // Wait a moment after typing before asking the API to search.
  useEffect(function () {
    const timer = setTimeout(function () {
      setDebouncedSearch(search);
    }, 300);

    return function () {
      clearTimeout(timer);
    };
  }, [search]);

  // Build query parameters for one page of results.
  function buildListParams() {
    return {
      search: debouncedSearch,
      status: status,
      employmentType: employmentType,
      from: from,
      to: to,
      sort: sort,
      order: order,
      page: page,
      limit: DEFAULT_PAGE_SIZE,
    };
  }

  // Build query parameters for the CSV, without pagination.
  function buildExportParams() {
    return {
      search: debouncedSearch,
      status: status,
      employmentType: employmentType,
      from: from,
      to: to,
      sort: sort,
      order: order,
    };
  }

  // Reload the list when any filter, sort option or page changes.
  useEffect(function () {
    let active = true;
    setLoading(true);
    setError('');

    fetchApplications(buildListParams())
      .then(function (data) {
        if (!active) {
          return;
        }
        const result = data.data;
        setItems(result.items || []);
        setPage(result.page || 1);
        setPages(result.pages || 0);
        setTotal(result.total || 0);
      })
      .catch(function (requestError) {
        if (!active) {
          return;
        }
        setError(getErrorMessage(requestError, 'Could not load your applications.'));
      })
      .finally(function () {
        if (active) {
          setLoading(false);
        }
      });

    return function () {
      active = false;
    };
  }, [debouncedSearch, status, employmentType, from, to, sort, order, page, retryCount]);

  // Each filter change goes back to the first page.
  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function changeStatus(value) {
    setStatus(value);
    setPage(1);
  }

  function changeType(value) {
    setEmploymentType(value);
    setPage(1);
  }

  function changeFrom(value) {
    setFrom(value);
    setPage(1);
  }

  function changeTo(value) {
    setTo(value);
    setPage(1);
  }

  function changeSort(value) {
    setSort(value);
    setPage(1);
  }

  function changeOrder(value) {
    setOrder(value);
    setPage(1);
  }

  // Reset every filter to its starting value.
  function clearFilters() {
    setSearch('');
    setStatus('');
    setEmploymentType('');
    setFrom('');
    setTo('');
    setSort('dateApplied');
    setOrder('desc');
    setPage(1);
  }

  function retry() {
    setRetryCount(retryCount + 1);
  }

  // Save the CSV blob the API returns with a generated file name.
  async function handleExport() {
    setExporting(true);
    setExportError('');

    try {
      const response = await exportApplications(buildExportParams());
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      let filename = buildCsvFilename();
      const disposition = response.headers['content-disposition'];

      if (disposition && disposition.indexOf('filename=') !== -1) {
        const pieces = disposition.split('filename=');
        const suggestedName = pieces[1].replace(/"/g, '').trim();
        if (suggestedName) {
          filename = suggestedName;
        }
      }

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      setExportError(getErrorMessage(requestError, 'Could not export your applications.'));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="page">
      <div className="page-heading page-heading-with-action">
        <div>
          <p className="eyebrow">Your search</p>
          <h1>Applications</h1>
          <p className="page-subtitle">Find, sort and export everything you have applied to.</p>
        </div>
        <Link className="button button-primary" to="/applications/new">+ Add application</Link>
      </div>

      <SearchFilterBar
        search={search}
        status={status}
        employmentType={employmentType}
        from={from}
        to={to}
        sort={sort}
        order={order}
        onSearchChange={changeSearch}
        onStatusChange={changeStatus}
        onEmploymentTypeChange={changeType}
        onFromChange={changeFrom}
        onToChange={changeTo}
        onSortChange={changeSort}
        onOrderChange={changeOrder}
        onReset={clearFilters}
        onExport={handleExport}
        exporting={exporting}
        resultCount={loading ? undefined : total}
      />

      <ErrorMessage message={exportError} title="Export failed" />
      <ErrorMessage message={error} onRetry={retry} />

      <section className="panel" aria-labelledby="list-heading">
        <h2 id="list-heading" className="visually-hidden">Application results</h2>
        <ApplicationTable
          items={items}
          loading={loading}
          emptyActionLabel="Add application"
          emptyActionTo="/applications/new"
        />
        <Pagination
          page={page}
          pages={pages}
          total={total}
          limit={DEFAULT_PAGE_SIZE}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
