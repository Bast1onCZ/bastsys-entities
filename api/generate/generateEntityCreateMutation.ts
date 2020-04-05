import firstLetterToLowerCase from '@bast1oncz/strings/dist/firstLetterToLowerCase'
import gql from 'graphql-tag'
import {Fragment, IdentifiableEntity} from '../types'
import extractFragmentName from '../../strings/extractFragmentName'

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
