import {Fragment, Mutation} from '../types'
import firstLetterToLowerCase from '@bast1oncz/strings/firstLetterToLowerCase'
import gql from 'graphql-tag'
import extractFragmentName from '../../strings/extractFragmentName'

/**
 *
 * @param fragment
 * @param mutationName if not defined, derived from fragment name
 * @param inputName if not defined, derived from fragment name
 */
export default function generateEntityUpdateMutation(fragment: Fragment, mutationName?: string, inputName?: string, withFilter: boolean = true): Mutation {
  const fragmentName = extractFragmentName(fragment)
  mutationName = mutationName || `${firstLetterToLowerCase(fragmentName)}Update`
  inputName = inputName || `${fragmentName}UpdateInput`
  
  return gql`
      ${fragment}
      mutation(${withFilter ? '$filter: NonNullIdInput!, ' : ''}$input: ${inputName}!) {
        entity: ${mutationName}(${withFilter ? 'filter: $filter, ' : ''}input: $input) {
        ...${fragmentName}
        }
      }
  `
}
