import {SyncFieldDefinition, UseSyncField} from './types'
import useEntityValue from './utils/useEntityValue'
import useResettableState from '@bast1oncz/state/useResettableState'
import {Ref, useCallback, useMemo} from 'react'
import useEntityContext from '../../components/EntityProvider/useEntityContext'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import ImmediatePromise from '@bast1oncz/objects/ImmediatePromise'
import useSyncFieldImperativeHandle from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import {useDynamicValidation} from '../useValidation'
import SyncFieldType from '../../components/syncField/syncFieldType'

export interface UseBooleanField extends UseSyncField<boolean, true> {

}

function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}

export default function useBooleanField(def: SyncFieldDefinition, ref?: Ref<any>): UseBooleanField {
    const {entity, readonly: disabledEntity, updateEntity} = useEntityContext()
    const disabled = def.disabled || disabledEntity
    const entityValue = useEntityValue(def)
    const exposedValue = useEntityValue(def, isBoolean, false)

    const validation = useDynamicValidation(entity, exposedValue, def.validate)

    const [syncingValue, setSyncingValue, resetSyncingValue] = useResettableState<undefined|boolean>(undefined)

    const confirmChange = useCallback((value: boolean) => {
        if(entityValue !== value) {
            const promise = updateEntity(new EntitySetValueRequest(def, value)) || new ImmediatePromise()
            setSyncingValue(value)
            return promise.finally(resetSyncingValue)
        }
    }, [entityValue, def, updateEntity])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.BOOLEAN,
        ...def,
        ...validation
    })

    return useMemo(() => ({
        confirmChange,
        isSyncing: syncingValue !== undefined,
        disabled,
        value: syncingValue !== undefined ? syncingValue : exposedValue
    }), [exposedValue, syncingValue, disabled, confirmChange])
}
