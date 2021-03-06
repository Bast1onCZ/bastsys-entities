import {SyncFieldDefinition} from './types'
import useSyncFieldImperativeHandle, {SyncFieldReference} from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import {useEntityContext} from '../../components/EntityProvider/EntityContext'
import useTempValue from '../useTempValue'
import useResettableState from '@bast1oncz/state/useResettableState'
import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import {useDynamicValidation, ValidationResult} from '../useValidation'
import {Ref, useCallback, useMemo} from 'react'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import ImmediatePromise from '@bast1oncz/objects/ImmediatePromise'
import SyncFieldType from '../../components/syncField/syncFieldType'
import moment, {Moment, isMoment} from 'moment'
import EntityDeleteValueRequest from '../../logic/updateRequest/EntityDeleteValueRequest'

/**
 * Validates whether currently typed date is valid
 *
 * @param value
 * @constructor
 */
function ValidDatetimeValidator(value: unknown): string|undefined {
    if(isMoment(value) && !value.isValid()) {
        return ' '
    }
}

export interface UseDateTimeField {
    isDirty: boolean
    isSyncing: boolean
    disabled: boolean
    tempValue: Moment|null|undefined
    shownValue: Moment|null
    validation: ValidationResult
    value: string,
    changeTempValue: (tempValue: Moment|null) => void
    confirmChange: (newValue?: Moment|null) => void
}

/**
 * Format compatible with bastsys api
 */
const MOMENT_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default function useDateTimeField(def: SyncFieldDefinition, ref: Ref<SyncFieldReference>): UseDateTimeField {
    const {sourceKey, updateKey, deleteKey, label, validate} = def

    const {entity, updateEntity, readonly: disabledEntity} = useEntityContext()
    const disabled = def.disabled || disabledEntity

    const {tempValue, setTempValue, resetTempValue, isActive: isDirty} = useTempValue<Moment|null>(`${label || 'Input'} value will be lost`)
    const [isSyncing, setIsSyncing, resetIsSyncing] = useResettableState(false)

    const entityValue: string = toKey(sourceKey).getFrom(entity) || ''

    const shownValue = useMemo<Moment|null>(() => {
        return tempValue !== undefined
            ? tempValue
            : entityValue
                ? moment(entityValue, MOMENT_FORMAT)
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

        setTempValue(newTempValue)
    }, [entityValue])
    const confirmChange = useCallback((newValue?: Moment|null) => {
        newValue = newValue === undefined ? tempValue : newValue
        if (newValue !== undefined) {
            const datetimeValue = newValue?.format(MOMENT_FORMAT) || null
            const request = datetimeValue !== null ? new EntitySetValueRequest(def, datetimeValue) : new EntityDeleteValueRequest(def)
            const promise = updateEntity(request) || new ImmediatePromise(undefined)
            // if async update has started
            setIsSyncing(true)
            promise.then(resetTempValue)
                .finally(resetIsSyncing)
        }
    }, [tempValue, updateEntity, sourceKey, updateKey, deleteKey])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.DATE_TIME,
        ...def,
        ...currentValidation
    })

    return useMemo(() => ({
        isDirty, isSyncing, tempValue, shownValue,
        validation: currentValidation,
        value: entityValue,
        changeTempValue, confirmChange, disabled
    }), [isDirty, isSyncing, tempValue, shownValue,
        currentValidation,
        entityValue,
        changeTempValue, confirmChange, disabled
    ])
}
