import {Fragment, Mutation} from '../types'
import firstLetterToLowerCase from '@bast1oncz/strings/firstLetterToLowerCase'
import gql from 'graphql-tag'
import extractFragmentName from '../../strings/extractFragmentName'

export default function generateEntityDeleteMutation(fragment: Fragment, mutationName?: string, inputName?: string): Mutation {
  const fragmentName = extractFragmentName(fragment)
  mutationName = mutationName || `${firstLetterToLowerCase(fragmentName)}Delete`
  inputName = inputName || `${fragmentName}DeleteInput`
  
  return gql`
    ${fragment}
    mutation($filter: NonNullMultiIdInput!, $input: ${inputName}!) {
        entities: ${mutationName}(filter: $filter, input: $input) {
            ...${fragmentName}
        }
    }
  `
}
