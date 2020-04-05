import {EntityFieldKeyDefinition} from './fieldReferences'
import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import {Entity} from '../api/types'

/**
 * Transforms local entity to an update object entity that can be send to api
 *
 * @param fieldDefs
 * @param localEntity
 */
export default function localEntityToUpdateObject(fieldDefs: EntityFieldKeyDefinition[], localEntity: Entity): Entity {
    return fieldDefs.reduce((acc, def) => {
        const {sourceKey, updateKey = sourceKey} = def

        const value = toKey(sourceKey).getFrom(localEntity)
        if (value !== undefined) {
            toKey(updateKey).setAt(acc, value) // if value is not set by user, is not send at all
        }

        return acc
    }, {})
}
