import cloneDeep from 'lodash/cloneDeep'
import AEntityUpdateRequest from 'logic/updateRequest/AEntityUpdateRequest'
import {joinKeys} from '@bast1oncz/objects/dist/ObjectPathKey'
import {Entity} from 'api/types'
import {EntityFieldKeyDefinition, FieldReference} from 'logic/fieldReferences'

/**
 * Sets value of an entity
 *
 * locally, uses sourceKey to update it
 * if updated by graphql, updateKey is prioritized, then sourceKey is used
 */
export default class EntitySetValueRequest<E extends Entity> extends AEntityUpdateRequest<E> {
  sourceKey: FieldReference
  updateKey: FieldReference

  value = null

  /**
   * @param {{sourceKey, updateKey?}} fieldDef
   * @param {Object|string|number|boolean} value
   */
  constructor(fieldDef: EntityFieldKeyDefinition, value: any) {
    super()

    if (value === null || value === undefined) {
      throw new Error('The value cannot be null or undefined')
    }

    this.sourceKey = fieldDef.sourceKey
    this.updateKey = fieldDef.updateKey || fieldDef.sourceKey

    this.value = value
  }

  /**
   * @param {Object} entity
   * @param {function} updateEntity
   * @returns {Promise|undefined}
   */
  performLocalUpdate(entity, updateEntity) {
    const newEntity = joinKeys(this.baseSourceKey, this.sourceKey)
      .setAt(
        cloneDeep(entity),
        this.value
      )

    return updateEntity(newEntity)
  }

  /**
   * @param {Object} entity
   * @param {Object} updateMutation
   * @param {Object} deleteMutation
   * @returns {Promise<FetchResult<any>>}
   */
  performGraphqlUpdate(entity, updateMutation, deleteMutation) {
    return this.apolloClient.mutate({
      mutation: updateMutation,
      variables: {
        filter: {
          id: entity.id
        },
        input: joinKeys(this.baseUpdateKey, this.updateKey).setAt({}, this.value)
      }
    })
  }
}
