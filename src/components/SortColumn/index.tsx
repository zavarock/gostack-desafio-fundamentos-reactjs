import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { SortLink } from './styles';

interface SortColumnProps {
  name: string;
  children: string;
}

const SortColumn: React.FC<SortColumnProps> = ({
  name,
  children,
}: SortColumnProps) => {
  const [active, isActive] = useState(false);
  const [descending, isDescending] = useState(false);

  let sortName = '';
  let sortType = '';

  const query = new URLSearchParams(useLocation().search);
  const sortParams = query.get('sort')?.split('.', 2);
  if (typeof sortParams !== 'undefined') {
    [sortName, sortType] = sortParams;
  }

  if (name !== sortName) {
    query.set('sort', name);
  } else if (sortType !== 'DESC') {
    query.set('sort', `${name}.DESC`);
  } else {
    query.delete('sort');
  }

  useEffect(() => {
    if (name === sortName) {
      isActive(true);

      if (sortType === 'DESC') {
        isDescending(true);
      } else {
        isDescending(false);
      }
    } else {
      isActive(false);
    }
  }, [name, sortName, sortType]);

  return (
    <SortLink
      to={`/?${query.toString()}`}
      $isActive={active}
      $isDescending={descending}
    >
      {children}
    </SortLink>
  );
};

export default SortColumn;
