import PropTypes from 'prop-types';
import React from 'react';

import cx from 'classnames';

function PagingInfo({
  className,
  end,
  searchTerm,
  start,
  totalResults,
  ...rest
}) {
  return (
    <div className={cx('sui-paging-info', className)} {...rest}>
      Showing{' '}
      <strong>
        {start} - {end}
      </strong>{' '}
      out of <strong>{totalResults}</strong>
      {searchTerm && (
        <>
          {' '}
          for:{' '}
          <em>
            {searchTerm.split('|').map((phrase, i) => (
              <>
                <u key={i}>{phrase}</u>{' '}
              </>
            ))}
          </em>
        </>
      )}
    </div>
  );
}

PagingInfo.propTypes = {
  end: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default PagingInfo;
