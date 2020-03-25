import {SyncFieldDefinition} from './types'
import useSyncFieldImperativeHandle, {SyncFieldReference} from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import {useEntityContext} from '../../components/EntityProvider/EntityContext'
import useTempValue from '../useTempValue'
import useResettableState from '@bast1oncz/state/dist/useResettableState'
import {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import {useDynamicValidation} from '../useValidation'
import {Ref, useCallback, useMemo} from 'react'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import ImmediatePromise from '@bast1oncz/objects/dist/ImmediatePromise'
import SyncFieldType from '../../components/syncField/syncFieldType'
import moment, {Moment, isMoment} from 'moment'

function ValidDatetimeValidator(value: unknown): string|undefined {
    if(isMoment(value) && !value.isValid) {
        value.isValid()

        return ' '
    }
}

export default function useDateTimeField(def: SyncFieldDefinition, ref: Ref<SyncFieldReference>) {
    const {sourceKey, updateKey, deleteKey, label, validate} = def

    const {entity, updateEntity} = useEntityContext()
    const {tempValue, setTempValue, resetTempValue, isActive: isDirty} = useTempValue<Moment|null>(`${label || 'Input'} value will be lost`)
    const [isSyncing, setIsSyncing, resetIsSyncing] = useResettableState(false)

    const entityValue: string = toKey(sourceKey).getFrom(entity) || ''

    const shownValue = useMemo<Moment|null>(() => {
        return tempValue !== undefined
            ? tempValue
            : entityValue
                ? moment(entityValue)
                : null
    }, [entityValue, tempValue])

    const validDatetimeValidation = useDynamicValidation(entity, shownValue, ValidDatetimeValidator)
    const userValidation = useDynamicValidation(entity, shownValue, validate)
    const currentValidation = validDatetimeValidation.hasError ? validDatetimeValidation : userValidation

    const changeTempValue = useCallback((tempValue: Moment|null) => {
        let newTempValue: any = undefined
        if(tempValue === null) {
            if(entityValue !== null) {
                newTempValue = null
            }
        } else if(isMoment(tempValue)) {
            if(moment(entityValue).format() !== tempValue.format()) {
                newTempValue = tempValue
            }
        }

        setTempValue(tempValue)
    }, [entityValue])
    const confirmChange = useCallback((newValue?: Moment|null) => {
        newValue = newValue === undefined ? tempValue : newValue
        if (newValue !== undefined) {
            const datetimeValue = newValue?.format() || null
            const promise = updateEntity(new EntitySetValueRequest(def, datetimeValue)) || new ImmediatePromise(undefined)
            // if async update has started
            setIsSyncing(true)
            promise.then(resetTempValue)
                .finally(resetIsSyncing)
        }
    }, [tempValue, updateEntity, sourceKey, updateKey])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.DATE_TIME,
        sourceKey,
        updateKey,
        deleteKey,
        ...currentValidation
    })

    return useMemo(() => ({
        isDirty, isSyncing, tempValue, shownValue,
        validation: currentValidation,
        value: entityValue,
        changeTempValue, confirmChange
    }), [isDirty, isSyncing, tempValue, shownValue,
        currentValidation,
        entityValue,
        changeTempValue, confirmChange
    ])
}
