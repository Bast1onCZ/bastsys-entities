import {Ref, useEffect, useImperativeHandle} from 'react'
import {EntityFieldKeyDefinition} from '../../logic/fieldReferences'
import SyncFieldType from '../syncField/syncFieldType'
import {ValidationResult} from '../../hooks/useValidation'
import values from 'lodash/values'
import {EntityContextValue, useEntityContext} from './EntityContext'

export interface SyncFieldReference extends EntityFieldKeyDefinition, ValidationResult {
    type: SyncFieldType
    disabled?: boolean
}

/**
 * Creates a sync field reference
 *
 * @param ref
 * @param input
 */
export default function useSyncFieldImperativeHandle(ref: Ref<SyncFieldReference> | undefined, input: SyncFieldReference) {
    // Context
    const {sourceKey, updateKey, deleteKey, disabled} = input

    let ctx: EntityContextValue<any>|{} = {}
    try {
        ctx = useEntityContext()
    } catch(err) {}

    const {registerFieldDefinition, unregisterFieldDefinition} = ctx as any
    useEffect(() => {
        if(!disabled) {
            registerFieldDefinition(input)

            return () => unregisterFieldDefinition(input)
        }
    }, [sourceKey.toString(), updateKey?.toString(), deleteKey?.toString(), input.error, registerFieldDefinition, unregisterFieldDefinition, disabled])

    // Reference
    useImperativeHandle<SyncFieldReference, SyncFieldReference>(ref, () => ({
        ...input
    }), [...values(input)])
}
