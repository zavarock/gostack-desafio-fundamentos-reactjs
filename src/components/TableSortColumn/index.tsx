import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Column } from './styles';

interface TableSortColumnProps {
  column: string;
  children: string;
}

const TableSortColumn: React.FC<TableSortColumnProps> = ({
  column,
  children,
}: TableSortColumnProps) => {
  const [active, isActive] = useState(false);
  const [descending, isDescending] = useState(false);

  let sortColumn = '';
  let sortColumnType = '';

  const query = new URLSearchParams(useLocation().search);
  const sort = query.get('sort')?.split('.', 2);
  if (typeof sort !== 'undefined') {
    [sortColumn, sortColumnType] = sort;
  }

  if (column !== sortColumn) {
    query.set('sort', column);
  } else if (sortColumnType !== 'DESC') {
    query.set('sort', `${column}.DESC`);
  } else {
    query.delete('sort');
  }

  useEffect(() => {
    if (column === sortColumn) {
      isActive(true);

      if (sortColumnType === 'DESC') {
        isDescending(true);
      } else {
        isDescending(false);
      }
    } else {
      isActive(false);
    }
  }, [column, sortColumn, sortColumnType]);

  return (
    <Column
      to={`/?${query.toString()}`}
      $isActive={active}
      $isDescending={descending}
    >
      {children}
    </Column>
  );
};

export default TableSortColumn;
