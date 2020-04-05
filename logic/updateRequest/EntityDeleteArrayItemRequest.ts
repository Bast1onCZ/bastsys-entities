import cloneDeep from 'lodash/cloneDeep'
import AEntityUpdateRequest from './AEntityUpdateRequest'
import {Entity, IdentifiableEntity, Mutation} from '../../api/types'
import {joinKeys} from '@bast1oncz/objects/ObjectPathKey'
import {FieldReference} from '../fieldReferences'
import {EntitiesResponseData} from './EntityDeleteRequest'

interface EntityDeleteArrayItemRequestConstructorInput {
  sourceKey: FieldReference
  updateKey?: FieldReference
  deleteKey?: FieldReference
  itemIdentity: object
}

/**
 * Handle entity array item delete
 */
export default class EntityDeleteArrayItemRequest<T extends Entity> extends AEntityUpdateRequest<T> {
  private sourceKey: FieldReference
  private updateKey: FieldReference
  itemIdentity: object

  /**
   * @param input
   */
  constructor(input: EntityDeleteArrayItemRequestConstructorInput) {
    super()

    this.sourceKey = input.sourceKey
    this.updateKey = input.updateKey || input.sourceKey

    this.itemIdentity = input.itemIdentity
  }

  /**
   * @param entity
   * @param updateEntity
   */
  performLocalUpdate(entity: T, updateEntity: (newEntity: any) => void): Promise<object> | void {
    const newEntity = joinKeys(this.baseSourceKey, this.sourceKey)
        .clone()
        .pushArrayObjectIdentityPointer(this.itemIdentity)
        .setAt(cloneDeep(entity), undefined)

    updateEntity(newEntity)
  }

  /**
   * @param entity
   * @param updateMutation
   * @param deleteMutation
   */
  performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation, deleteMutation: Mutation): Promise<EntitiesResponseData<T>> {
    const input = joinKeys(this.baseUpdateKey, this.updateKey)
        .clone()
        .pushArrayObjectIdentityPointer(this.itemIdentity)
        .setAt({}, {...this.itemIdentity, delete: true})

    return this.apolloClient.mutate({
      mutation: updateMutation,
      variables: {
        filter: {id: entity.id},
        input
      }
    })
  }
}
