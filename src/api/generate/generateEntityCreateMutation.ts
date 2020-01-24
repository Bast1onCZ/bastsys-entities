import {Fragment, IdentifiableEntity} from 'api/types'
import extractFragmentName from 'strings/extractFragmentName'
import firstLetterToLowerCase from '@bast1oncz/strings/dist/firstLetterToLowerCase'
import gql from 'graphql-tag'

export interface CreateEntityMutationResponseData<E = IdentifiableEntity> {
  entity: E
}

export default function generateEntityCreateMutation(fragment: Fragment, mutationName?: string, inputName?: string) {
  const fragmentName = extractFragmentName(fragment)
  mutationName = mutationName || `${firstLetterToLowerCase(fragmentName)}Create`
  inputName = inputName || `${fragmentName}CreateInput`
  
  return gql`
    ${fragment}
    mutation($input: ${inputName}!) {
        entity: ${mutationName}(input: $input) {
            ...${fragmentName}
        }
    }
  `
}
