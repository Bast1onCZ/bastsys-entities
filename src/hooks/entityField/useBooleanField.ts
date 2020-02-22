import {SyncFieldDefinition, UseSyncField} from './types'
import useEntityValue from './utils/useEntityValue'
import useResettableState from '@bast1oncz/state/dist/useResettableState'
import {Ref, useCallback, useMemo} from 'react'
import useEntityContext from '../../components/EntityProvider/useEntityContext'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import ImmediatePromise from '@bast1oncz/objects/dist/ImmediatePromise'
import useSyncFieldImperativeHandle from '../../components/EntityProvider/useSyncFieldImperativeHandle'
import useValidation from '../useValidation'
import SyncFieldType from '../../components/syncField/syncFieldType'

export interface UseBooleanField extends UseSyncField<boolean> {

}

function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}

export default function useBooleanField(def: SyncFieldDefinition, ref?: Ref<any>): UseBooleanField {
    const entityValue = useEntityValue(def)
    const exposedValue = useEntityValue(def, isBoolean, false)
    const {updateEntity} = useEntityContext()
    const validation = useValidation(exposedValue, def.validate)

    const [isSyncing, setIsSyncing, resetIsSyncing] = useResettableState(false)

    const confirmChange = useCallback((value: boolean) => {
        if(entityValue !== value) {
            const promise = updateEntity(new EntitySetValueRequest(def, value)) || new ImmediatePromise()
            setIsSyncing(true)
            return promise.finally(resetIsSyncing)
        }
    }, [])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.BOOLEAN,
        ...def,
        ...validation
    })

    return useMemo(() => ({
        confirmChange,
        isSyncing,
        value: exposedValue
    }), [exposedValue, isSyncing, confirmChange])
}
