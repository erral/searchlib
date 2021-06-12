import React from 'react';
import { withAppConfig } from '@eeacms/search/lib/hocs';
import {
  SearchBox,
  Results,
  Result,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
} from '@elastic/react-search-ui';
import { Facets, ViewSelector, FilterList } from '@eeacms/search/components';
import registry from '@eeacms/search/registry';

export const SearchView = (props) => {
  const { wasSearched, setSearchTerm, appConfig, appName } = props;
  const { defaultSearchText } = appConfig;

  React.useEffect(() => {
    if (!wasSearched) {
      setSearchTerm(defaultSearchText);
    }
  }, [wasSearched, setSearchTerm, defaultSearchText]);

  const { sortOptions, resultViews } = appConfig;
  const defaultViewId =
    resultViews.filter((v) => v.isDefault)[0]?.id || 'listing';
  const [activeViewId, setActiveViewId] = React.useState(defaultViewId);

  const listingViewDef = resultViews.filter((v) => v.id === activeViewId)[0];
  console.log(listingViewDef);

  const Item = registry.resolve[listingViewDef.factories.item].component;
  const ResultViewComponent =
    registry.resolve[listingViewDef.factories.view].component;
  // const itemViewProps = listingViewDef.params;
  const itemViewProps = appConfig[`${activeViewId}ViewParams`];
  console.log('viewprops', itemViewProps);
  const Layout = registry.resolve[appConfig.layoutComponent].component;
  console.log('layout', Layout, appConfig.layoutComponent);

  const availableResultViews = [
    ...resultViews.filter(({ id }) =>
      Object.keys(appConfig).includes(`${id}ViewParams`)
        ? appConfig[`${id}ViewParams`].enabled
        : true,
    ),
  ];

  // TODO: improve searchbox

  return (
    <div className={`searchapp searchapp-${appName}`}>
      <Layout
        appConfig={appConfig}
        header={
          <SearchBox
            autocompleteMinimumCharacters={3}
            autocompleteResults={{
              linkTarget: '_blank',
              sectionTitle: 'Results',
              titleField: 'Measure_name',
              urlField: 'CodeCatalogue',
              shouldTrackClickThrough: true,
              clickThroughTags: ['test'],
            }}
            autocompleteSuggestions={true}
          />
        }
        sideContent={
          <>
            <Sorting label={'Sort by'} sortOptions={sortOptions} />
            <Facets />
          </>
        }
        bodyContent={
          <>
            <FilterList {...props} />
            <ViewSelector
              views={availableResultViews}
              active={activeViewId}
              onSetView={setActiveViewId}
            />
            <Results
              shouldTrackClickThrough={true}
              view={({ children }) => {
                return <ResultViewComponent>{children}</ResultViewComponent>;
              }}
              resultView={(props) => (
                <Result {...props} {...itemViewProps} view={Item} />
              )}
            />
          </>
        }
        bodyHeader={
          <>
            <h1>{appConfig.title}</h1>
            <PagingInfo />
            <ResultsPerPage />
          </>
        }
        bodyFooter={<Paging />}
      />
    </div>
  );
};

export default withAppConfig(SearchView);
