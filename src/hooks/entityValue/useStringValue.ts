import {Ref, useCallback, useContext, useMemo, useRef, useState} from 'react'
import useTempValue from 'hooks/useTempValue'
import {useDynamicValidation, ValidationResult} from 'hooks/useValidation'
import {SyncFieldDefinition} from 'hooks/entityValue/types'
import EditableEntityContext, {EditableEntityContextValue} from 'components/EntityProvider/EditableEntityContext'
import {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import EntitySetValueRequest from 'logic/updateRequest/EntitySetValueRequest'
import useSyncFieldImperativeHandle from 'components/EntityProvider/useSyncFieldImperativeHandle'
import SyncFieldType from 'components/syncField/SyncFieldType'
import ImmediatePromise from '@bast1oncz/objects/dist/ImmediatePromise'

export interface UseStringValue {
    tempValue?: string
    value: string
    validation: ValidationResult
    isDirty: boolean
    isSyncing: boolean
    changeTempValue: (tempValue: string) => void
    confirmChange: VoidFunction
}

export default function useStringValue(def: SyncFieldDefinition, ref: Ref<any>): UseStringValue {
    const {sourceKey, updateKey, deleteKey, label, validate} = def

    const {entity, updateEntity} = useContext(EditableEntityContext) as EditableEntityContextValue<any>
    const {tempValue, setTempValue, resetTempValue, isActive: isDirty} = useTempValue(`${label || 'Input'} value will be lost`)
    const [isSyncing, setIsSyncing] = useState(false)
    const inputRef = useRef<HTMLInputElement>()

    const entityValue = toKey(sourceKey).getFrom(entity)
    const localValue = tempValue !== undefined
        ? tempValue
        : entityValue

    const entityValueValidation = useDynamicValidation(entity, entityValue, validate)
    const localValueValidation = useDynamicValidation(entity, localValue, validate)

    const changeTempValue = useCallback(tempValue => setTempValue(tempValue !== entityValue ? tempValue : undefined), [entityValue])
    const confirmChange = useCallback(() => {
        if (tempValue !== undefined) {
            const promise = updateEntity(new EntitySetValueRequest(def, tempValue))
            // if async update has started
            setIsSyncing(true)
            promise || new ImmediatePromise(undefined)
                .then(resetTempValue)
                .finally(() => setIsSyncing(false))
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
        value: entityValue,
        changeTempValue, confirmChange
    }), [isDirty, isSyncing, tempValue,
        localValueValidation,
        entityValue,
        changeTempValue, confirmChange
    ])
}
