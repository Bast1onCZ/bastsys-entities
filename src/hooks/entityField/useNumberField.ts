import useTempValue from 'hooks/useTempValue'
import {Ref, useCallback, useMemo, useState} from 'react'
import useValidation, {ValidationResult} from 'hooks/useValidation'
import {SyncFieldDefinition} from 'hooks/entityField/types'
import useSyncFieldImperativeHandle from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import useEntityContext from '../../components/EntityProvider/useEntityContext'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import ImmediatePromise from '@bast1oncz/objects/dist/ImmediatePromise'
import {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import SyncFieldType from '../../components/syncField/SyncFieldType'

export interface UseNumberField {
    tempValue?: number
    value: number
    validation: ValidationResult
    isDirty: boolean
    isSyncing: boolean
    changeTempValue: (tempValue: string | number) => void
    confirmChange: VoidFunction
}

export default function useNumberValue(def: SyncFieldDefinition, ref: Ref<any>): UseNumberField {
    const {label, updateKey, sourceKey, deleteKey, validate} = def
    const {entity, updateEntity} = useEntityContext()

    const {tempValue, setTempValue, resetTempValue, isActive: isDirty} = useTempValue(`${label || 'Input'} value will be lost`)
    const [isSyncing, setIsSyncing] = useState(false)

    const entityValue = toKey(sourceKey).getFrom(entity)

    const entityValueValidation = useValidation(entityValue, validate)
    const tempValueValidation = useValidation(tempValue !== undefined ? tempValue : entityValue, validate)

    const changeTempValue = useCallback((newTempValue: string | number) => {
        const parsedTempValue = +newTempValue // parsed number
        // if parsed number is equal to entity value and can be also converted to unchanged rawValue, tempValue is considered equal and set to undefined
        setTempValue(parsedTempValue === entityValue && parsedTempValue.toString() === newTempValue.toString()
            ? undefined
            : newTempValue
        )
    }, [])
    const confirmChange = useCallback(() => {
        if (tempValue !== undefined) {
            const promise = updateEntity(new EntitySetValueRequest(def, +tempValue)) || new ImmediatePromise(undefined)
            setIsSyncing(true)
            promise.then(resetTempValue)
                .finally(() => setIsSyncing(false))
        }
    }, [tempValue])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.NUMBER,
        sourceKey,
        updateKey,
        deleteKey,
        ...entityValueValidation
    })

    return useMemo(() => ({
        changeTempValue, confirmChange, tempValue, isDirty, isSyncing, validation: tempValueValidation, value: entityValue
    }), [changeTempValue, confirmChange, tempValue, isDirty, isSyncing, tempValueValidation, entityValue])
}