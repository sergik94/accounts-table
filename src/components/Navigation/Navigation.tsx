import { FC } from 'react';
import { Link } from 'react-router-dom';

import './Navigation.scss';

type Props = {
  currAccount: number | null;
  currProfile: number | null;
  setCurrAccount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrProfile: React.Dispatch<React.SetStateAction<number | null>>;
};

export const Navigation: FC<Props> = ({
  currAccount,
  currProfile,
  setCurrAccount,
  setCurrProfile,
}) => {
  return (
    <div className="page-navigation">
      <Link
        to="/"
        className="page-navigation__home-link"
        onClick={() => {
          setCurrAccount(null);
          setCurrProfile(null);
        }}
      />

      {currAccount && (
        <Link
          to={`/account/${currAccount}`}
          className="page-navigation__current-page-link"
          style={{
            pointerEvents: `${!currProfile ? 'none' : 'initial'}`,
          }}
          onClick={() => setCurrProfile(null)}
        >
          {`Account #${currAccount}`}
        </Link>
      )}

      {currProfile && (
        <p className="page-navigation__current-page-link">
          {`Profile #${currProfile}`}
        </p>
      )}
    </div>
  );
};
