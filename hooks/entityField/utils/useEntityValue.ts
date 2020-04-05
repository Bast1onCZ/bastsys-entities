import {SyncFieldDefinition} from '../types'
import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import useEntityContext from '../../../components/EntityProvider/useEntityContext'

export type TypeValidatorFunction<T> = (value: any) => value is T

/**
 * Uses entity field value.
 * Value is first validated by typeValidator.
 * If not approved, default value is used.
 *
 * @param def
 * @param typeValidator
 * @param defaultValue
 */
export default function useEntityValue<T>(def: SyncFieldDefinition, typeValidator?: TypeValidatorFunction<T>, defaultValue?: T): T {
    const {sourceKey} = def

    const {entity} = useEntityContext()
    const value = toKey(sourceKey).getFrom(entity)

    if(typeValidator && !typeValidator(value)) {
        console.warn('Type validator returned false for sync field ', def, ', default value ', {defaultValue}, ' was returned')
        if(defaultValue === undefined) {
            throw new Error('Cannot return default value because it is undefined')
        }

        return defaultValue
    }

    return value
}
