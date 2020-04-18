import cloneDeep from 'lodash/cloneDeep'
import AEntityUpdateRequest from './AEntityUpdateRequest'
import {joinKeys} from '@bast1oncz/objects/ObjectPathKey'
import {Entity, IdentifiableEntity, isIdentifiableEntity, Mutation} from '../../api/types'
import {EntityFieldKeyDefinition, FieldReference} from '../fieldReferences'

/**
 * Sets value of an entity
 *
 * locally, uses sourceKey to update it
 * if updated by graphql, updateKey is prioritized, then sourceKey is used
 */
export default class EntitySetValueRequest<E extends Entity> extends AEntityUpdateRequest<E> {
    sourceKey: FieldReference
    updateKey: FieldReference

    value: any

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

    performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation) {
        let remoteValueToSet
        if (isIdentifiableEntity(this.value)) {
            // if remote value is IdentifiableEntity, then only its id should be sent
            remoteValueToSet = this.value.id
        } else {
            remoteValueToSet = this.value
        }

        return this.apolloClient.mutate({
            mutation: updateMutation,
            variables: {
                filter: {
                    id: entity.id
                },
                input: joinKeys(this.baseUpdateKey, this.updateKey).setAt({}, remoteValueToSet)
            }
        })
    }
}
