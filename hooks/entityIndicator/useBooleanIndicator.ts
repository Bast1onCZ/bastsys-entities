import {useCallback, useMemo} from 'react'
import ImmediatePromise from '@bast1oncz/objects/ImmediatePromise'
import useBooleanSetResetState from '@bast1oncz/state/useBooleanSetResetState'
import EntitySetValueRequest from '../../logic/updateRequest/EntitySetValueRequest'
import {FieldReference} from '../../logic/fieldReferences'
import {useEntityContext} from '../../components/EntityProvider/EntityContext'

export interface UseBooleanButtonInput<T> {
    updateKey: FieldReference
    onCompleted?: (prevEntity: T, newEntity: T) => void
}

export interface UseBooleanIndicator {
    disabled: boolean
    isSyncing: boolean
}

export default function useBooleanButton<T>(input: UseBooleanButtonInput<T>) {
    const {updateKey, onCompleted} = input

    const {entity, updateEntity, isSyncing: disabled} = useEntityContext()

    const [isSyncing, setIsSyncing, resetIsSyncing] = useBooleanSetResetState()

    const confirm = useCallback(() => {
        const promise = updateEntity(new EntitySetValueRequest({sourceKey: updateKey, updateKey}, true)) || new ImmediatePromise()
        setIsSyncing()
        promise
            .then(promise => onCompleted?.(entity, promise?.data?.entity || promise))
            .finally(resetIsSyncing)
    }, [entity, updateKey, updateEntity, onCompleted])

    return useMemo(() => ({
        disabled,
        isSyncing,
        confirm
    }), [isSyncing, disabled, confirm])
}
