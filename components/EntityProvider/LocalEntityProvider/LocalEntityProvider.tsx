import React, {forwardRef, memo, useMemo} from 'react'
import {LocalEntityProviderProps} from './types'
import EditableEntityContext, {EntityContextValue, EntitySettings} from '../EntityContext'
import useEntityFieldDefinitions from '../useEntityFieldDefinitions'
import UpdateMethodType from '../UpdateMethodType'
import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import AEntityUpdateRequest from '../../../logic/updateRequest/AEntityUpdateRequest'
import useEntityDefinitionImperativeHandle, {EntityDefinition} from '../useEntityDefinitionImperativeHandle'

const LocalEntityProvider = forwardRef<EntityDefinition, LocalEntityProviderProps>((props, ref) => {
    const {entity, sourceKey = '', updateKey, deleteKey, children, updateEntity, readonly = false} = props

    const settings: EntitySettings<any> = useMemo(() => ({
        type: UpdateMethodType.LOCAL_UPDATE,
        updateEntity,
        sourceKey, updateKey, deleteKey, entity, readonly: readonly
    }), [updateEntity, sourceKey, updateKey, deleteKey, entity, readonly])

    const exposedEntity = toKey(sourceKey).getFrom(entity)

    const {isPrepared, fieldRefs, registerFieldDefinition, unregisterFieldDefinition} = useEntityFieldDefinitions(settings)
    const contextValue: EntityContextValue<any> = useMemo(() => {
        return {
            entity: exposedEntity,
            updateEntity: ((updateRequest: AEntityUpdateRequest<any>) => {
                updateRequest.setBaseKeys(sourceKey, updateKey, deleteKey)
                updateRequest.performLocalUpdate(entity, updateEntity)
            }),
            isSyncing: false,
            settings, readonly: readonly, registerFieldDefinition, unregisterFieldDefinition
        }
    }, [exposedEntity,
        sourceKey, updateKey, deleteKey,
        entity, updateEntity,
        settings, readonly, registerFieldDefinition, unregisterFieldDefinition
    ])

    useEntityDefinitionImperativeHandle({isPrepared, fieldRefs}, ref)

    return (
        <EditableEntityContext.Provider value={contextValue}>
            {children}
        </EditableEntityContext.Provider>
    )
})

export default memo(LocalEntityProvider)
