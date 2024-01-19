/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../assets/styles/blocks/itemsList.scss';
import Pagination from '../Pagination/Pagination';
import { Account } from '../../types/Accounts';
import { Loader } from '../Loader';
import classNames from 'classnames';
import { SearchLink } from '../SearchLink/SearchLink';
import { sortItems } from '../../features/sortItems';
import { getSearchWith } from '../../features/searchHelper';
import { useDebounce } from 'use-debounce';
import { geExtremeItemPerPage } from '../../features/geExtremeItemPerPage';
import { getYearsArray } from '../../features/getYearsArray';

const ITEMS_PER_PAGE = 15;

type Props = {
  items: Account[];
  getProfilesFromServer: (id: number) => void;
};

export const AccountsList: FC<Props> = ({ items, getProfilesFromServer }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = +(searchParams.get('page') || 1);
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  const query = searchParams.get('query') || '';
  const years = searchParams.getAll('years') || [];
  const [appliedQuery] = useDebounce(query, 500);
  const dataArray = items.map((item) => item.creationDate);
  const yearsArray = getYearsArray(dataArray);
  const theadList = ['Email', 'Token', 'Creation Date'];

  let keys = [] as string[];

  if (items[0]) {
    keys = Object.keys(items[0]).slice(1);
  }

  function filterByQuery(str: string | null) {
    return (
      str?.toLowerCase().includes(appliedQuery?.toLowerCase() || '') || false
    );
  }

  const modifiedItemsList = useMemo(() => {
    let filteredArray = [...items];

    if (!order && !sort && !query && !years) {
      return filteredArray;
    }

    if (query || years) {
      filteredArray = items.filter((acc) => {
        return (
          filterByQuery(acc.email) &&
          (!years.length || years.includes(acc.creationDate.split('-')[2]))
        );
      });
    }

    if (sort) {
      return sortItems(filteredArray, sort, order) as Account[];
    }

    return filteredArray;
  }, [order, sort, query, appliedQuery, years, items]);

  const [firstItemPerPage, lastItemPerPage] = geExtremeItemPerPage(
    page,
    ITEMS_PER_PAGE,
    modifiedItemsList.length,
  );

  const routeToProfile = (id: number) => {
    navigate(`/account/${id}`);
    getProfilesFromServer(id);
  };

  const onChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = getSearchWith(searchParams, {
      query: `${e.currentTarget.value}` || null,
    });

    setSearchParams(newSearchParams);
  };

  if (!items.length) {
    return <Loader />;
  }

  return (
    <div className="app__items items">
      <h1 className="items__title">Accounts</h1>

      <div className="items__controllers">
        <div className="items__filters-container">
          <input
            className="items__input"
            type="text"
            placeholder="Search account by email..."
            value={query}
            onChange={onChangeQuery}
          />
          <div className="items__years">
            Years:
            {yearsArray.map((year) => (
              <SearchLink
                key={year}
                params={{
                  years: years.includes(year)
                    ? years.filter((y) => y !== year)
                    : [...years, year],
                }}
                className={classNames('items__year', {
                  'items__year--is-active': years.includes(year),
                })}
                style={{
                  color: `${years.includes(year) ? '#fff' : ''}`,
                }}
              >
                {year}
              </SearchLink>
            ))}
          </div>
        </div>
        {ITEMS_PER_PAGE < modifiedItemsList.length && (
          <Pagination
            totalItems={modifiedItemsList.length}
            itemPerPage={ITEMS_PER_PAGE}
          />
        )}
      </div>

      <table className="items__table">
        <thead>
          <tr className="items__head-row">
            <th>#</th>
            {theadList.map((theadName, index) => {
              let newSortParams = {};

              if (sort !== keys[index]) {
                newSortParams = { sort: keys[index], order: null };
              } else if (sort === keys[index] && order === null) {
                newSortParams = { order: 'desc' };
              } else {
                newSortParams = { sort: null, order: null };
              }

              return (
                <th key={theadName}>
                  <SearchLink params={newSortParams}>
                    {theadName}
                    <span className="items__icon">
                      <i
                        className={classNames(
                          'fas',
                          { 'fa-sort': sort !== keys[index] },
                          { 'fa-sort-up': sort === keys[index] && !order },
                          {
                            'fa-sort-down': sort === keys[index] && !!order,
                          },
                        )}
                      />
                    </span>
                  </SearchLink>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {modifiedItemsList
            .slice(firstItemPerPage, lastItemPerPage)
            .map((account) => (
              <tr
                key={account.accountId}
                onClick={() => routeToProfile(account.accountId)}
                className="items__body-row"
              >
                <td>{account.accountId}</td>
                <td>{account.email}</td>
                <td>{account.authToken}</td>
                <td>{account.creationDate}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
