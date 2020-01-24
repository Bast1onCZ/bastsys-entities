import cloneDeep from 'lodash/cloneDeep'
import AEntityUpdateRequest from 'logic/updateRequest/AEntityUpdateRequest'
import {Entity, IdentifiableEntity, Mutation} from 'api/types'
import {joinKeys} from '@bast1oncz/objects/dist/ObjectPathKey'
import {FieldReference} from 'logic/fieldReferences'
import {EntitiesResponseData} from 'logic/updateRequest/EntityDeleteRequest'

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
  sourceKey: FieldReference
  deleteKey: FieldReference
  itemIdentity: object

  /**
   * @param input
   */
  constructor(input: EntityDeleteArrayItemRequestConstructorInput) {
    super()

    this.sourceKey = input.sourceKey
    this.deleteKey = input.deleteKey || input.updateKey || input.sourceKey

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
    const input = joinKeys(this.baseDeleteKey, this.deleteKey)
        .clone()
        .pushArrayObjectIdentityPointer(this.itemIdentity)
        .setAt({}, this.itemIdentity)

    return this.apolloClient.mutate({
      mutation: deleteMutation,
      variables: {
        filter: {id: [entity.id]},
        input
      }
    })
  }
}
