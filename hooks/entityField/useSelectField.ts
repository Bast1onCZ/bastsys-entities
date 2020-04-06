import {SyncFieldDefinition} from './types'
import {ReactChild, Ref, useCallback, useMemo} from 'react'
import {IdentifiableEntity, isIdentifiableEntity} from '../../api/types'
import useEntityContext from '../../components/EntityProvider/useEntityContext'
import {joinKeys, toKey} from '@bast1oncz/objects/ObjectPathKey'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import EntityDeleteValueRequest from '../../logic/updateRequest/EntityDeleteValueRequest'
import ImmediatePromise from '@bast1oncz/objects/ImmediatePromise'
import useResettableState from '@bast1oncz/state/dist/useResettableState'
import useSyncFieldImperativeHandle from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import SyncFieldType from '../../components/syncField/syncFieldType'
import {useDynamicValidation, ValidationResult} from '../useValidation'
import AEntityUpdateRequest from '../../logic/updateRequest/AEntityUpdateRequest'

export interface SelectOption {
    id: IdentifiableEntity['id'] extends '' ? never : IdentifiableEntity['id']
    label: ReactChild
    entity?: IdentifiableEntity
}

export interface UseSelectField {
    value: IdentifiableEntity['id']
    confirmChange: (id: string|null) => void
    isSyncing: boolean
    disabled: boolean
    validation: ValidationResult
}

export interface SelectFieldInput extends SyncFieldDefinition {
    options?: SelectOption[]
}

export default function useSelectField(def: SelectFieldInput, ref: Ref<any>): UseSelectField {
    const {sourceKey, updateKey, deleteKey, validate, options} = def

    const {entity, updateEntity, readonly: disabledEntity} = useEntityContext()
    const disabled = def.disabled || disabledEntity

    const value = toKey(sourceKey).getFrom(entity)

    const isEntitySelect = useMemo(() => {
        const isEntitySelect = isIdentifiableEntity(value) || (options || []).some(option => option.entity)
        if(isEntitySelect) {
            if(options?.some(option => !option.entity)) {
                throw new Error('Entity is not defined in all options')
            }
            if(!!value && !isIdentifiableEntity(value)) {
                throw new Error('Entity is not IdentifiableEntity while options are entities')
            }
        } else {
            if(isIdentifiableEntity(value)) {
                throw new Error('Entity value is IdentifiableEntity, but options are not')
            }
        }

        return isEntitySelect
    }, [value, options])

    const valueId = isEntitySelect ? value?.id : value

    const validation = useDynamicValidation(entity, value, validate)
    const [isSyncing, setIsSyncing, resetIsSyncing] = useResettableState(false)

    const confirmChange = useCallback((id: IdentifiableEntity['id']|null) => {
        if(valueId === id) {
            // entity value is the same as new value
            return
        }

        let request: AEntityUpdateRequest<any>
        if(id) {
            const option = (options as SelectOption[]).find(option => option.id === id)
            const valueToSet = (option as SelectOption).entity || {id: (option as SelectOption).id}

            request = new EntitySetValueRequest(def, valueToSet)
        } else {
            request = new EntityDeleteValueRequest(def)
        }

        const promise = updateEntity(request) || new ImmediatePromise(undefined)
        setIsSyncing(true)
        promise.finally(resetIsSyncing)
    }, [valueId, updateEntity, options])

    const idSourceKey = useMemo(() => {
        if(isEntitySelect) {
            return joinKeys(sourceKey, 'id')
        }
        return sourceKey
    }, [sourceKey, isEntitySelect])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.SELECT,
        sourceKey: idSourceKey,
        updateKey,
        deleteKey,
        ...validation
    })

    return useMemo(() => ({
        value: valueId,
        confirmChange,
        isSyncing,
        validation,
        disabled
    }), [valueId, confirmChange, validation, isSyncing, disabled])
}
