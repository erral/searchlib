import {
  applyDisjunctiveFaceting,
  buildRequest,
  buildState,
  getAutocompleteSuggestions,
} from './search';
import { default as runRequest } from './runRequest';

export function onResultClick() {
  /* Not implemented */
}

export function onAutocompleteResultClick() {
  /* Not implemented */
}

export async function onAutocomplete(props) {
  const config = this;

  console.log('onautocomplete', props);

  return {
    autocompletedSuggestions: await getAutocompleteSuggestions(props, config),
    autocompletedResults: [],
  };
}

export async function onSearch(state) {
  console.log('onsearch');
  const config = this;
  const { resultsPerPage } = state;
  const requestBody = buildRequest(state, config);
  // console.log('onSearch', { requestBody, config, state });

  // Note that this could be optimized by running all of these requests
  // at the same time. Kept simple here for clarity.
  const responseJson = await runRequest(requestBody, config);

  const { body } = responseJson;

  const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
    body,
    state,
    config,
  );

  const newState = buildState(
    responseJsonWithDisjunctiveFacetCounts,
    resultsPerPage,
    config,
  );

  return newState; //{ ...state, ...newState };
}
