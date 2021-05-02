import { Facet } from '@elastic/react-search-ui';
import {
  LeftColumnLayout,
  TableRowItem,
  TableView,
} from '@eeacms/search/components';
import ListingViewItem from '@eeacms/search/components/Result/ListingViewItem';
import { Item } from 'semantic-ui-react';
import {
  onResultClick,
  onAutocompleteResultClick,
  onAutocomplete,
  onSearch,
} from './request';

const config = {
  componentFactories: {
    'searchui.Facet': Facet,
  },

  searchui: {
    default: {
      // debug: true,
      hasA11yNotifications: true,
      onResultClick,
      onAutocompleteResultClick,
      onAutocomplete,
      onSearch,

      // visually layout the search components (header, side, etc)
      layoutComponent: LeftColumnLayout,

      // when entering in search view, use this to search
      defaultSearchText: '',

      highlight: {
        fragment_size: 200,
        number_of_fragments: 1,
        fields: {},
      },

      resultViews: [
        {
          id: 'listing',
          title: 'Items',
          icon: null,
          render: null,
          isDefault: true,
          viewComponent: Item.Group,
          itemComponent: ListingViewItem,
        },
        {
          id: 'table',
          title: 'Table',
          icon: null,
          render: null,
          isDefault: false,
          viewComponent: TableView,
          itemComponent: TableRowItem,
        },
      ],

      // parameters for the 'listing' Listing View
      // The config will lookup for `${id}ViewParams` objects
      listingViewParams: {
        enabled: true,
      },

      tableViewParams: {
        enabled: true,
      },

      sortOptions: [
        {
          name: 'Relevance',
          value: '',
          direction: '',
        },
      ],
    },
  },
};

if (window) {
  window.searchUiConfig = config;
}

export default config;
