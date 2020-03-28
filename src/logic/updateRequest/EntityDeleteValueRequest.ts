import {Entity, IdentifiableEntity, Mutation} from '../../api/types'
import AEntityUpdateRequest, {UpdateEntityFunction} from './AEntityUpdateRequest'
import {EntityFieldKeyDefinition, FieldReference} from '../fieldReferences'
import {joinKeys} from '@bast1oncz/objects/dist/ObjectPathKey'
import {EntityResponseData} from '../../api/generate/generateEntityQuery'
import cloneDeep from 'lodash/cloneDeep'

/**
 * Deletes a value from an entity
 *
 * sourceKey is used for local update
 * deleteKey, then updateKey and at last the sourceKey is used for graphql update
 */
export default class EntityDeleteValueRequest<E extends Entity> extends AEntityUpdateRequest<E> {
  sourceKey: FieldReference
  deleteKey: FieldReference

  constructor(fieldDef: EntityFieldKeyDefinition) {
    super()

    this.sourceKey = fieldDef.sourceKey
    this.deleteKey = fieldDef.deleteKey || fieldDef.updateKey || fieldDef.sourceKey
  }

  /**
   * @param {Object} entity
   * @param {function} updateEntity
   * @returns {Promise|undefined}
   */
  performLocalUpdate(entity: E, updateEntity: UpdateEntityFunction) {
    const newEntity = joinKeys(this.baseSourceKey, this.sourceKey)
      .setAt(
        cloneDeep(entity),
        undefined
      )

    return updateEntity(newEntity)
  }

  /**
   * @param {Object} entity
   * @param {Object} updateMutation
   * @param {Object} deleteMutation
   * @returns {Promise<FetchResult<any>>}
   */
  performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation, deleteMutation: Mutation): Promise<EntityResponseData<E>> {
    return this.apolloClient.mutate({
      mutation: deleteMutation,
      variables: {
        filter: {
          id: [entity.id]
        },
        input: joinKeys(this.baseDeleteKey, this.deleteKey).setAt({}, true)
      }
    })
  }
}
