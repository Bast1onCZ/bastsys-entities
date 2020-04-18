import {Ref, useCallback, useMemo} from 'react'
import useTempValue from '../useTempValue'
import {useDynamicValidation, ValidationResult} from '../useValidation'
import {SyncFieldDefinition} from './types'
import {useEntityContext} from '../../components/EntityProvider/EntityContext'
import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import useSyncFieldImperativeHandle, {SyncFieldReference} from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import SyncFieldType from '../../components/syncField/syncFieldType'
import ImmediatePromise from '@bast1oncz/objects/ImmediatePromise'
import useResettableState from '@bast1oncz/state/useResettableState'

export interface UseStringField {
    tempValue?: string
    value: string
    validation: ValidationResult
    isDirty: boolean
    isSyncing: boolean
    changeTempValue: (tempValue: string) => void
    confirmChange: VoidFunction
    disabled: boolean
}

export default function useStringValue(def: SyncFieldDefinition, ref: Ref<SyncFieldReference>): UseStringField {
    const {sourceKey, updateKey, deleteKey, label, validate} = def

    const {entity, updateEntity, readonly: disabledEntity} = useEntityContext()
    const disabled = def.disabled || disabledEntity

    const {tempValue, setTempValue, resetTempValue, isActive: isDirty} = useTempValue<string>(`${label || 'Input'} value will be lost`)
    const [isSyncing, setIsSyncing, resetIsSyncing] = useResettableState(false)

    const entityValue = toKey(sourceKey).getFrom(entity)
    const entityStringValue = entityValue || ''
    const localValue = tempValue !== undefined
        ? tempValue
        : entityValue

    const entityValueValidation = useDynamicValidation(entity, entityValue, validate)
    const localValueValidation = useDynamicValidation(entity, localValue, validate)

    const changeTempValue = useCallback(tempValue => setTempValue(tempValue !== entityValue ? tempValue : undefined), [entityValue])
    const confirmChange = useCallback(() => {
        if (tempValue !== undefined) {
            const promise = updateEntity(new EntitySetValueRequest(def, tempValue)) || new ImmediatePromise(undefined)
            // if async update has started
            setIsSyncing(true)
            promise.then(resetTempValue)
                .finally(resetIsSyncing)
        }
    }, [tempValue, updateEntity, sourceKey, updateKey])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.STRING,
        sourceKey,
        updateKey,
        deleteKey,
        ...entityValueValidation
    })

    return useMemo(() => ({
        isDirty, isSyncing, tempValue,
        validation: localValueValidation,
        value: entityStringValue,
        changeTempValue, confirmChange, disabled
    }), [isDirty, isSyncing, tempValue,
        localValueValidation,
        entityValue,
        changeTempValue, confirmChange, disabled
    ])
}
