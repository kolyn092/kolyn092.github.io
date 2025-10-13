import React from 'react';

// 데이터 테이블 컴포넌트
const DataTable = React.memo(function DataTable({
  data = [],
  columns = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onView,
  className = '',
  emptyMessage = '데이터가 없습니다.',
}) {
  if (loading) {
    return (
      <div className="data-table-loading">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-table-error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="data-table-empty">
        <div className="empty-message">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="table-header">
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete || onView) && (
              <th className="table-header">작업</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="table-cell">
                  {column.render 
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]
                  }
                </td>
              ))}
              {(onEdit || onDelete || onView) && (
                <td className="table-cell">
                  <div className="table-actions">
                    {onView && (
                      <button
                        onClick={() => onView(row, rowIndex)}
                        className="btn btn-sm btn-info"
                        title="보기"
                      >
                        👁️
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row, rowIndex)}
                        className="btn btn-sm btn-warning"
                        title="수정"
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row, rowIndex)}
                        className="btn btn-sm btn-danger"
                        title="삭제"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default DataTable;
