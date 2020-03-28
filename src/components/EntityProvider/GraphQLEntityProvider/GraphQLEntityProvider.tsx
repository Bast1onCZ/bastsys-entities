import React, {forwardRef, memo, useMemo} from 'react'
import EditableEntityContext, {EntityContextValue} from '../EntityContext'
import {GraphQLEntityProviderProps} from './types'
import UpdateMethodType from '../UpdateMethodType'
import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import AEntityUpdateRequest from '../../../logic/updateRequest/AEntityUpdateRequest'
import useEntityFieldDefinitions from '../useEntityFieldDefinitions'
import useEntityDefinitionImperativeHandle, {EntityDefinition} from '../useEntityDefinitionImperativeHandle'
import {useApolloClient} from '@apollo/react-hooks'
import useResettableState from '@bast1oncz/state/dist/useResettableState'

const GraphQLEntityProvider = forwardRef<EntityDefinition, GraphQLEntityProviderProps>((props, ref) => {
    const {children, sourceKey = '', updateKey = '', deleteKey = '', entity, updateMutation, deleteMutation} = props

    const exposedEntity = toKey(sourceKey).getFrom(entity)
    const settings = useMemo(() => ({
        type: UpdateMethodType.GRAPHQL_UPDATE,
        sourceKey, updateKey, deleteKey, entity, updateMutation, deleteMutation
    }), [sourceKey, updateKey, deleteKey, entity, updateMutation, deleteMutation])
    const {isPrepared, fieldRefs, registerFieldDefinition, unregisterFieldDefinition} = useEntityFieldDefinitions(settings)

    const client = useApolloClient()
    if(!client) {
        throw new Error('A configured apollo client is required')
    }

    const [isSyncing, setIsSyncing, resetIsSyncing] = useResettableState(false)

    const contextValue: EntityContextValue<any> = useMemo(() => ({
        type: UpdateMethodType.GRAPHQL_UPDATE,
        entity: exposedEntity,
        settings,
        updateEntity: (request: AEntityUpdateRequest<any>) => {
            request.setBaseKeys(sourceKey, updateKey, deleteKey)
            request.setApolloClient(client)

            setIsSyncing(true)
            return request.performGraphqlUpdate(entity, updateMutation, deleteMutation)
                .finally(resetIsSyncing)
        },
        isSyncing,
        registerFieldDefinition,
        unregisterFieldDefinition
    }), [
        entity, updateMutation, deleteMutation, exposedEntity,
        sourceKey, updateKey, deleteKey,
        settings,
        isSyncing, registerFieldDefinition, unregisterFieldDefinition
    ])

    useEntityDefinitionImperativeHandle({isPrepared, fieldRefs}, ref)

    return (
        <EditableEntityContext.Provider value={contextValue}>
            {children}
        </EditableEntityContext.Provider>
    )
})

export default memo(GraphQLEntityProvider)
