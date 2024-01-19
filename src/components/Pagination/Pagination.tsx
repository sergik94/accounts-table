import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';

import './Pagination.scss';
import { goTop } from '../../features/goTop';
import { getSearchWith } from '../../features/searchHelper';

type Props = {
  totalItems: number;
  itemPerPage: number;
};

export default function Pagination({ totalItems, itemPerPage }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currPage, setCurrPage] = useState(+(searchParams.get('page') || 1));

  const changePageBy = (page: number) => {
    const newSearchParams = getSearchWith(searchParams, {
      page: `${page}`,
    });
    setSearchParams(newSearchParams);
    setCurrPage(page);
    goTop();
  };
  const pagesNumber = Math.ceil(totalItems / itemPerPage);

  const pages = [];

  for (let i = 1; i <= pagesNumber; i++) {
    pages.push(i);
  }

  return (
    <div className="todos__pagination pagination">
      <button
        className="pagination__button pagination__button--left button"
        disabled={currPage === 1}
        onClick={() => changePageBy(currPage - 1)}
      />
      <div className="pagination__buttons">
        {pages.map((page) => (
          <button
            key={page}
            className={cn('pagination__button', 'button', {
              'pagination__button--active': page === currPage,
            })}
            onClick={() => changePageBy(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className="pagination__button pagination__button--right button"
        disabled={currPage === pagesNumber}
        onClick={() => changePageBy(currPage + 1)}
      />
    </div>
  );
}
