import {Ref, useImperativeHandle, useMemo} from 'react'
import {SyncFieldReference} from './useSyncFieldImperativeHandle'
import {EntityProviderReference} from './types'

export interface EntityDefinitionImperativeHandleInput {
    isPrepared: boolean
    fieldRefs: SyncFieldReference[]
}

export interface EntityDefinition extends EntityDefinitionImperativeHandleInput {
   isValid: boolean
}

export default function useEntityDefinitionImperativeHandle(input: EntityDefinitionImperativeHandleInput, ref: Ref<EntityProviderReference>): void {
    const {isPrepared, fieldRefs} = input

    const isValid = useMemo(() => {
        return isPrepared && !fieldRefs.some(fieldRef => fieldRef.hasError)

    }, [isPrepared, fieldRefs])

    useImperativeHandle(ref, () => ({
        isPrepared,
        fieldRefs,
        isValid
    }), [isPrepared, fieldRefs, isValid])
}
