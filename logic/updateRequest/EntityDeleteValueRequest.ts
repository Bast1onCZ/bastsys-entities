import {Entity, IdentifiableEntity, Mutation} from '../../api/types'
import AEntityUpdateRequest, {UpdateEntityFunction} from './AEntityUpdateRequest'
import {EntityFieldKeyDefinition, FieldReference} from '../fieldReferences'
import {joinKeys} from '@bast1oncz/objects/ObjectPathKey'
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

  performLocalUpdate(entity: E, updateEntity: UpdateEntityFunction) {
    const newEntity = joinKeys(this.baseSourceKey, this.sourceKey)
      .setAt(
        cloneDeep(entity),
        undefined
      )

    return updateEntity(newEntity)
  }

  performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation): Promise<EntityResponseData<E>> {
    return this.apolloClient.mutate({
      mutation: updateMutation,
      variables: {
        filter: {
          id: entity.id
        },
        input: joinKeys(this.baseDeleteKey, this.deleteKey).setAt({}, null)
      }
    })
  }
}
