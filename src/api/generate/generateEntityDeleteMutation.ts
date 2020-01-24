import {Fragment, Mutation} from 'api/types'
import extractFragmentName from 'strings/extractFragmentName'
import firstLetterToLowerCase from '@bast1oncz/strings/dist/firstLetterToLowerCase'
import gql from 'graphql-tag'

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
