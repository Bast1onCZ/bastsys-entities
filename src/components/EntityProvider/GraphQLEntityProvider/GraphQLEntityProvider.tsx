import React, {forwardRef, memo, useContext, useMemo} from 'react'
import EditableEntityContext, {EditableEntityContextValue} from '../EditableEntityContext'
import {GraphQLEntityProviderProps} from './types'
import UpdateMethodType from '../UpdateMethodType'
import {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import AEntityUpdateRequest from '../../../logic/updateRequest/AEntityUpdateRequest'
import useEntityFieldDefinitions from '../useEntityFieldDefinitions'
import useEntityDefinitionImperativeHandle, {EntityDefinition} from '../useEntityDefinitionImperativeHandle'
import {useApolloClient} from '@apollo/react-hooks'

const GraphQLEntityProvider = forwardRef<EntityDefinition, GraphQLEntityProviderProps>((props, ref) => {
    const {children, sourceKey = '', updateKey, deleteKey, entity, updateMutation, deleteMutation} = props

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

    const contextValue: EditableEntityContextValue<any> = useMemo(() => ({
        type: UpdateMethodType.GRAPHQL_UPDATE,
        entity: exposedEntity,
        settings,
        updateEntity: (request: AEntityUpdateRequest<any>) => {
            request.setBaseKeys(sourceKey, updateKey, deleteKey)
            request.setApolloClient(client)
            return request.performGraphqlUpdate(entity, updateMutation, deleteMutation)
        },
        registerFieldDefinition,
        unregisterFieldDefinition
    }), [entity, updateMutation, deleteMutation, exposedEntity, settings, sourceKey, updateKey, deleteKey, registerFieldDefinition, unregisterFieldDefinition])

    useEntityDefinitionImperativeHandle({isPrepared, fieldRefs}, ref)

    return (
        <EditableEntityContext.Provider value={contextValue}>
            {children}
        </EditableEntityContext.Provider>
    )
})

export default memo(GraphQLEntityProvider)
