import React from 'react';
import { withSearch, Facet } from '@elastic/react-search-ui';
import { helpers } from '@elastic/search-ui';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import { ToggleSort } from '@eeacms/search/components';
import { useSort } from '@eeacms/search/lib/hocs';
// import { Table } from 'semantic-ui-react';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

const Select = ({ options, value, onChange }) => {
  const handler = (e) => onChange(e.target.value);
  // console.log('value', value);

  return (
    <select onBlur={handler} onChange={handler} value={value}>
      {options.map((opt) => (
        <option value={opt.value} key={opt.key}>
          {opt.text}
        </option>
      ))}
    </select>
  );
};

const ViewComponent = (props) => {
  const {
    className,
    label,
    onMoreClick,
    onRemove,
    onSelect,
    options,
    showMore,
    showSearch,
    onSearch,
    searchPlaceholder,
    onChangeFilterType,
    filterType = 'any',
  } = props;

  const filterTypes = [
    { key: 2, text: 'Match any', value: 'any' },
    { key: 1, text: 'Match all', value: 'all' },
  ];

  // const sortedOptions = sorted(options, sortOn, sortOrder);

  const {
    sortedValues: sortedOptions,
    toggleSort,
    sorting,
  } = useSort(options, ['value', 'count'], {
    defaultSortOn: 'count',
    defaultSortOrder: 'descending',
  });

  return (
    <fieldset className={cx('sui-facet', className)}>
      <legend className="sui-facet__title">{label}</legend>

      {showSearch && (
        <div className="sui-facet-search">
          <input
            className="sui-facet-search__text-input"
            type="search"
            placeholder={searchPlaceholder || 'Search'}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
          />
        </div>
      )}

      <Select
        className="match-select"
        value={filterType}
        options={filterTypes}
        onChange={onChangeFilterType}
      />
      {options.length < 1 && <div>No matching options</div>}

      <div className="sui-multi-checkbox-facet">
        <div className="sui-multi-checkbox-facet__option-label">
          <div className="sui-multi-checkbox-facet__option-input-wrapper">
            <div className="sui-multi-checkbox-facet__checkbox"></div>
            <span className="sui-multi-checkbox-facet__input-text">
              <ToggleSort
                label={label}
                onToggle={() => toggleSort('value')}
                on={sorting.sortOn === 'value'}
                icon={
                  sorting.sortOrder === 'ascending' ? (
                    <Icon name="sort alphabet ascending" />
                  ) : (
                    <Icon name="sort alphabet descending  " />
                  )
                }
              />
            </span>
          </div>
          <span className="sui-multi-checkbox-facet__option-count">
            <ToggleSort
              label="Count"
              onToggle={() => toggleSort('count')}
              on={sorting.sortOn === 'count'}
              icon={
                sorting.sortOrder === 'ascending' ? (
                  <Icon name="sort numeric ascending" />
                ) : (
                  <Icon name="sort numeric descending" />
                )
              }
            />
          </span>
        </div>
      </div>

      <div className="sui-multi-checkbox-facet">
        {sortedOptions.map((option) => {
          const checked = option.selected;
          return (
            <label
              key={`${getFilterValueDisplay(option.value)}`}
              htmlFor={`example_facet_${label}${getFilterValueDisplay(
                option.value,
              )}`}
              className="sui-multi-checkbox-facet__option-label"
            >
              <div className="sui-multi-checkbox-facet__option-input-wrapper">
                <input
                  id={`example_facet_${label}${getFilterValueDisplay(
                    option.value,
                  )}`}
                  type="checkbox"
                  className="sui-multi-checkbox-facet__checkbox"
                  checked={checked}
                  onChange={() =>
                    checked ? onRemove(option.value) : onSelect(option.value)
                  }
                />
                <span className="sui-multi-checkbox-facet__input-text">
                  {getFilterValueDisplay(option.value)}
                </span>
              </div>
              <span className="sui-multi-checkbox-facet__option-count">
                {option.count.toLocaleString('en')}
              </span>
            </label>
          );
        })}
      </div>

      {showMore && (
        <button
          type="button"
          className="sui-facet-view-more"
          onClick={onMoreClick}
          aria-label="Show more options"
        >
          + More
        </button>
      )}
    </fieldset>
  );
};

const MultiTypeFacetComponent = (props) => {
  // console.log('facet props', props);
  const { field, addFilter, removeFilter, filters } = props;
  const [filterType, setFilterType] = React.useState('any');
  const filterValue = filters.find((f) => f.field === field);
  return (
    <Facet
      {...props}
      filterType={filterType}
      show={100000}
      view={(props) => (
        <ViewComponent
          filterType={filterType}
          onChangeFilterType={(filterType) => {
            if (!filterValue) {
              setFilterType(filterType);
              return;
            }
            removeFilter(field);
            filterValue?.values?.forEach((v) => {
              addFilter(filterValue.field, v, filterType);
            });
            setFilterType(filterType);
          }}
          {...props}
        />
      )}
    />
  );
};

export default withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify,
  }),
)(MultiTypeFacetComponent);

// {false && (
//   <Table>
//     <Table.Header>
//       <Table.Row>
//         <Table.HeaderCell>Count</Table.HeaderCell>
//         <Table.HeaderCell>{label}</Table.HeaderCell>
//         <Table.HeaderCell></Table.HeaderCell>
//       </Table.Row>
//     </Table.Header>
//     <Table.Body>
//       {options.map((option, index) => {
//         const checked = option.selected;
//         return (
//           <Table.Row key={index}>
//             <Table.Cell>
//               <label
//                 key={`${getFilterValueDisplay(option.value)}`}
//                 htmlFor={`example_facet_${label}${getFilterValueDisplay(
//                   option.value,
//                 )}`}
//                 className="sui-multi-checkbox-facet__option-label"
//               >
//                 <span className="sui-multi-checkbox-facet__option-count">
//                   {option.count.toLocaleString('en')}
//                 </span>
//               </label>
//             </Table.Cell>
//             <Table.Cell>
//               <div className="sui-multi-checkbox-facet__option-input-wrapper">
//                 <span className="sui-multi-checkbox-facet__input-text">
//                   {getFilterValueDisplay(option.value)}
//                 </span>
//               </div>
//             </Table.Cell>
//             <Table.Cell>
//               <input
//                 id={`example_facet_${label}${getFilterValueDisplay(
//                   option.value,
//                 )}`}
//                 type="checkbox"
//                 className="sui-multi-checkbox-facet__checkbox"
//                 checked={checked}
//                 onChange={() =>
//                   checked
//                     ? onRemove(option.value)
//                     : onSelect(option.value)
//                 }
//               />
//             </Table.Cell>
//           </Table.Row>
//         );
//       })}
//     </Table.Body>
//   </Table>
// )}
