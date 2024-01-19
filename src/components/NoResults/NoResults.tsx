import { Link } from 'react-router-dom';

import './NoResults.scss';

export const NoResults = () => {
  return (
    <div className="no-results">
      <h2 className="no-results__title">Page not found</h2>
      <Link to="/" className="no-results__link">
        Go Home
      </Link>
    </div>
  );
};
