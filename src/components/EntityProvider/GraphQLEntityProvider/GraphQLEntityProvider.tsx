import React, {forwardRef, memo, useContext, useMemo} from 'react'
import EditableEntityContext, {EditableEntityContextValue, EditableEntitySettings} from '../EditableEntityContext'
import {GraphQLEntityProviderProps} from './types'
import {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import AEntityUpdateRequest from '../../../logic/updateRequest/AEntityUpdateRequest'
import {getApolloContext} from '@apollo/react-common/lib/context/ApolloContext'
import useEntityFieldDefinitions from '../useEntityFieldDefinitions'
import useEntityDefinitionImperativeHandle, {EntityDefinition} from '../useEntityDefinitionImperativeHandle'

const GraphQLEntityProvider = forwardRef<EntityDefinition, GraphQLEntityProviderProps>((props, ref) => {
    const {children, sourceKey = '', updateKey, deleteKey, entity, updateMutation, deleteMutation} = props

    const exposedEntity = toKey(sourceKey).getFrom(entity)
    const settings = useMemo<EditableEntitySettings>(() => ({
        type: 'graphql',
        sourceKey, updateKey, deleteKey, entity, updateMutation, deleteMutation
    }), [sourceKey, updateKey, deleteKey, entity, updateMutation, deleteMutation])
    const {isPrepared, fieldRefs, registerFieldDefinition, unregisterFieldDefinition} = useEntityFieldDefinitions(settings)

    const {client} = useContext(getApolloContext())
    if(!client) {
        throw new Error('A configured apollo client is required')
    }

    const contextValue: EditableEntityContextValue<any> = useMemo(() => ({
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
