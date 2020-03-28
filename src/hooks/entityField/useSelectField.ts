import {SyncFieldDefinition} from './types'
import {Ref, useCallback, useMemo} from 'react'
import {IdentifiableEntity} from '../../api/types'
import useEntityContext from '../../components/EntityProvider/useEntityContext'
import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import EntityDeleteValueRequest from '../../logic/updateRequest/EntityDeleteValueRequest'
import ImmediatePromise from '@bast1oncz/objects/ImmediatePromise'
import useResettableState from '@bast1oncz/state/dist/useResettableState'
import useSyncFieldImperativeHandle from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import SyncFieldType from '../../components/syncField/syncFieldType'
import {useDynamicValidation, ValidationResult} from '../useValidation'

export interface UseSelectField {
    value: IdentifiableEntity['id']
    confirmChange: (id: IdentifiableEntity['id']|null) => void
    isSyncing: boolean
    validation: ValidationResult
}

export default function useSelectField(def: SyncFieldDefinition, ref: Ref<any>): UseSelectField {
    const {sourceKey, updateKey, deleteKey, validate} = def

    const {entity, updateEntity} = useEntityContext()
    const value = toKey(sourceKey).getFrom(entity)
    const validation = useDynamicValidation(entity, value, validate)
    const [isSyncing, setIsSyncing, resetIsSyncing] = useResettableState(false)

    const confirmChange = useCallback((id: IdentifiableEntity['id']|null) => {
        if(value === id) {
            // entity value is the same as new value
            return null
        }

        const promise = (id ? updateEntity(new EntitySetValueRequest(def, id)) : updateEntity(new EntityDeleteValueRequest(def))) || new ImmediatePromise(undefined)
        setIsSyncing(true)
        promise.finally(resetIsSyncing)
    }, [value, updateEntity])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.SELECT,
        sourceKey,
        updateKey,
        deleteKey,
        ...validation
    })

    return useMemo(() => ({
        value,
        confirmChange,
        isSyncing,
        validation
    }), [value, confirmChange, validation, isSyncing])
}
