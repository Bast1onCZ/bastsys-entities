import gql from 'graphql-tag'
import firstLetterToLowerCase from '@bast1oncz/strings/dist/firstLetterToLowerCase'
import {Fragment, Query} from '../types'
import extractFragmentName from '../../strings/extractFragmentName'

interface ListQueryOptions {
  withoutFilter?: boolean
  filterName?: string
  queryName?: string
}

/**
 * Generates entity list query
 *
 * @param fragment
 * @param options
 */
export default function(fragment: Fragment, options: ListQueryOptions = {}): Query {
  const fragmentName = extractFragmentName(fragment)
  
  const {
    withoutFilter,
    filterName = `${fragmentName}Filter`,
    queryName = `${firstLetterToLowerCase(fragmentName)}List`
  } = options
  
  return gql`
    ${fragment}
    query($orderBy: [OrderByInput], $pagination: PaginationInput${withoutFilter ? '' : `, $filter: ${filterName}`}) {
        list: ${queryName}(orderBy: $orderBy, pagination: $pagination${withoutFilter ? '' : ', filter: $filter'}) {
            pageInfo {
                hasNextPage
                limit
                offset
            }
            totalCount
            edges {
                ...${fragmentName}
            }
        }
    }
  `
}
