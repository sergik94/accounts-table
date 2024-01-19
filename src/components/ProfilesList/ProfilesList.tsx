/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import '../../assets/styles/blocks/itemsList.scss';
import Pagination from '../Pagination/Pagination';
import { Profile } from '../../types/Profile';
import { Loader } from '../Loader';
import { SearchLink } from '../SearchLink/SearchLink';
import classNames from 'classnames';
import { sortItems } from '../../features/sortItems';
import { geExtremeItemPerPage } from '../../features/geExtremeItemPerPage';
import { getSearchWith } from '../../features/searchHelper';

const ITEMS_PER_PAGE = 10;

type Props = {
  items: Profile[];
  getCampaignsFromServer: (id: number) => void;
};

export const ProfilesList: FC<Props> = ({ items, getCampaignsFromServer }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = +(searchParams.get('page') || 1);
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  const query = searchParams.get('query') || '';
  const filteredBy = searchParams.get('filteredBy') || 'country';
  const [appliedQuery] = useDebounce(query, 500);
  const theadList = ['Country', 'Marketplace'];

  const { accountId = '' } = useParams();

  let keys = [] as string[];

  if (items[1]) {
    keys = Object.keys(items[1]).slice(1);
  }

  function filterByQuery(str: string | null) {
    return (
      str?.toLowerCase().includes(appliedQuery?.toLowerCase() || '') || false
    );
  }

  const modifiedItemsList = useMemo(() => {
    let filteredArray = [...items];

    if (!order && !sort && !query) {
      return filteredArray;
    }

    if (query) {
      filteredArray = items.filter((item) => {
        const value = item[filteredBy] as string;

        return filterByQuery(value);
      });
    }

    if (sort) {
      return sortItems(filteredArray, sort, order) as Profile[];
    }

    return filteredArray;
  }, [order, sort, appliedQuery, filteredBy, items]);

  const [firstItemPerPage, lastItemPerPage] = geExtremeItemPerPage(
    page,
    ITEMS_PER_PAGE,
    modifiedItemsList.length,
  );

  const routeToProfile = (id: number) => {
    navigate(`/account/${accountId}/profile/${id}`);

    getCampaignsFromServer(id);
  };

  const onChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = getSearchWith(searchParams, {
      query: `${e.currentTarget.value}` || null,
    });

    setSearchParams(newSearchParams);
  };

  const onChangeFilteredBy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = getSearchWith(searchParams, {
      filteredBy: `${e.currentTarget.value}` || null,
    });

    setSearchParams(newSearchParams);
  };

  if (!items.length) {
    return <Loader />;
  }

  return (
    <div className="app__items items">
      <h1 className="items__title">Profiles</h1>

      <div className="items__controllers">
        <div className="items__filters-container">
          <div className="items__filteredBy">
            Filtered by:
            {theadList.map((theadName) => (
              <label className="items__radio-label" key={theadName}>
                <input
                  type="radio"
                  className="items__radio-input"
                  name="filteredBy"
                  value={theadName.toLowerCase()}
                  onChange={onChangeFilteredBy}
                  checked={filteredBy === theadName.toLowerCase()}
                />
                {theadName}
              </label>
            ))}
          </div>
          <input
            className="items__input"
            type="text"
            placeholder={`Search account by ${filteredBy}...`}
            value={query}
            onChange={onChangeQuery}
          />
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
            .map((item) => (
              <tr
                key={item.profileId}
                className="items__body-row"
                onClick={() => routeToProfile(item.profileId)}
              >
                <td>{item.profileId}</td>
                <td>{item.country}</td>
                <td>{item.marketplace}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
