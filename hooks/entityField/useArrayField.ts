import {SyncFieldDefinition, UseSyncField} from './types'
import {Ref, useCallback, useMemo} from 'react'
import {useEntityContext} from '../../components/EntityProvider/EntityContext'
import useEntityValue from './utils/useEntityValue'
import {useDynamicValidation, ValidationResult} from '../useValidation'
import useSyncFieldImperativeHandle from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import SyncFieldType from '../../components/syncField/syncFieldType'
import useTempValue from '../useTempValue'
import useBooleanSetResetState from '@bast1oncz/state/useBooleanSetResetState'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import ImmediatePromise from '@bast1oncz/objects/ImmediatePromise'

export interface UseArrayField<T> extends UseSyncField<T[]> {
    tempValue: T|undefined
    isDirty: boolean
    setTempValue: (tempValue: T|undefined) => void
    validation: ValidationResult
    handleTempChange: (tempValue: T) => void
}

function isArray(value: unknown): value is Array<any> {
    return value instanceof Array
}

export default function useArrayField<T>(def: SyncFieldDefinition, ref?: Ref<any>): UseArrayField<T> {
    const {entity, readonly: disabledEntity, updateEntity} = useEntityContext()
    const disabled = def.disabled || disabledEntity
    const entityValue = useEntityValue(def)
    const exposedValue = useEntityValue(def, isArray, [])
    console.log({entity, entityValue, exposedValue})
    const {tempValue, isActive, setTempValue, resetTempValue} = useTempValue<T>(`${def.label || 'Input'} value will be lost`)

    const entityValueValidation = useDynamicValidation(entity, entityValue, def.validate)
    const localValueValidation = useDynamicValidation(entity, exposedValue, def.validate)

    const [isSyncing, setIsSyncing, resetIsSyncing] = useBooleanSetResetState(false)
    const handleTempChange = useCallback((value: T) => {
        setTempValue(value)
    }, [setTempValue])
    const confirmChange = useCallback((value?: T[]) => {
        value = value || [...exposedValue, tempValue]

        const promise = updateEntity(new EntitySetValueRequest(def, value)) || new ImmediatePromise()
        resetTempValue()
        setIsSyncing()
        promise.catch(() => setTempValue(tempValue))
            .finally(resetIsSyncing)
    }, [def, exposedValue, updateEntity, tempValue])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.SCALAR_ARRAY,
        ...def,
        ...entityValueValidation
    })

    return useMemo(() => ({
        value: exposedValue,
        tempValue,
        isDirty: isActive,
        setTempValue,
        validation: localValueValidation,
        disabled,
        isSyncing,
        handleTempChange,
        confirmChange
    }), [exposedValue, tempValue, isActive, setTempValue, disabled, isSyncing, handleTempChange, confirmChange, localValueValidation])
}
