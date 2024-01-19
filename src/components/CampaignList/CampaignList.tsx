/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import '../../assets/styles/blocks/itemsList.scss';
import Pagination from '../Pagination/Pagination';
import { Campaign } from '../../types/Campaign';
import { Loader } from '../Loader';
import { sortItems } from '../../features/sortItems';
import { SearchLink } from '../SearchLink/SearchLink';
import classNames from 'classnames';
import { geExtremeItemPerPage } from '../../features/geExtremeItemPerPage';
import { getSearchWith } from '../../features/searchHelper';

const ITEMS_PER_PAGE = 10;

type Props = {
  items: Campaign[];
};

export const CampaignList: FC<Props> = ({ items }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams.get('page') || 1);
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  const minCost = Math.min(...items.map((item) => item.cost));
  const maxCost = Math.max(...items.map((item) => item.cost));
  const costFrom = searchParams.get('costFrom') || '';
  const costTo = searchParams.get('costTo') || '';
  const [appliedCostFrom] = useDebounce(costFrom, 500);
  const [appliedCostTo] = useDebounce(costTo, 500);
  const theadList = ['Clicks', 'Cost', 'Date'];

  let keys = [] as string[];

  if (items[0]) {
    keys = Object.keys(items[0]).slice(1);
  }

  const modifiedItemsList = useMemo(() => {
    let filteredArray = [...items];

    if (!order && !sort && !costFrom && !costTo) {
      return items;
    }

    if (costFrom || costTo) {
      const minValue = appliedCostFrom || minCost;
      const maxValue = appliedCostTo || maxCost;

      filteredArray = items.filter((item) => {
        return item.cost >= +minValue && item.cost <= +maxValue;
      });
    }

    if (sort) {
      return sortItems(filteredArray, sort, order) as Campaign[];
    }

    return filteredArray;
  }, [order, sort, appliedCostFrom, appliedCostTo, items]);

  const [firstItemPerPage, lastItemPerPage] = geExtremeItemPerPage(
    page,
    ITEMS_PER_PAGE,
    modifiedItemsList.length,
  );

  const onChangeCostFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(+e.currentTarget.value)) {
      return;
    }

    const newSearchParams = getSearchWith(searchParams, {
      costFrom: `${e.currentTarget.value}` || null,
    });

    setSearchParams(newSearchParams);
  };

  const onChangeCostTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(+e.currentTarget.value)) {
      return;
    }

    const newSearchParams = getSearchWith(searchParams, {
      costTo: `${e.currentTarget.value}` || null,
    });

    setSearchParams(newSearchParams);
  };

  if (!items.length) {
    return <Loader />;
  }

  return (
    <div className="app__items items">
      <h1 className="items__title">Campaigns</h1>

      <div className="items__controllers">
        <div className="items__cost">
          <span>Cost:</span>
          <label className="items__cost-label">
            <span>From</span>
            <input
              type="text"
              className="items__input items__input--cost"
              placeholder={minCost + ''}
              value={costFrom}
              onChange={onChangeCostFrom}
              style={{
                backgroundColor: `${+costFrom > (+costTo || maxCost) && !!costFrom ? 'pink' : ''}`,
              }}
            />
          </label>
          <label className="items__cost-label">
            <span>To</span>
            <input
              type="text"
              className="items__input items__input--cost"
              placeholder={maxCost + ''}
              value={costTo}
              onChange={onChangeCostTo}
              style={{
                backgroundColor: `${(+costFrom || minCost) > +costTo && !!costTo ? 'pink' : ''}`,
              }}
            />
          </label>
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
              <tr key={item.campaignId}>
                <td>{item.campaignId}</td>
                <td>{item.clicks}</td>
                <td>$ {item.cost}</td>
                <td>{item.date}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
