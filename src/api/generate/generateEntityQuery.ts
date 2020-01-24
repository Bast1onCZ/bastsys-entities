import {Entity, Fragment, Query} from 'api/types'
import firstLetterToLowerCase from '@bast1oncz/strings/dist/firstLetterToLowerCase'
import extractFragmentName from 'strings/extractFragmentName'
import gql from 'graphql-tag'

export interface EntityResponseData<E extends Entity> {
  entity: E
}

/**
 *
 * @param fragment
 * @param queryName if not defined, derived from fragment name
 * @param withFilter if false given, request does not contain filter
 */
export default function generateEntityQuery(fragment: Fragment, queryName?: string, withFilter: boolean = true): Query {
  const fragmentName = extractFragmentName(fragment)
  queryName = queryName || firstLetterToLowerCase(fragmentName)
  
  return gql`
    ${fragment}
    query${withFilter ? '($filter: NonNullIdInput!)' : ''} {
        entity: ${queryName}${withFilter ? '(filter: $filter)' : ''} {
            ...${fragmentName}
        }
    }
  `
}
