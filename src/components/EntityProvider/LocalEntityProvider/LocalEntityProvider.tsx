import React, {forwardRef, memo, useMemo} from 'react'
import {LocalEntityProviderProps} from './types'
import {EditableEntityContextValue, EditableEntitySettings} from '../EditableEntityContext'
import useEntityFieldDefinitions from '../useEntityFieldDefinitions'
import UpdateMethodType from '../UpdateMethodType'
import {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import AEntityUpdateRequest from '../../../logic/updateRequest/AEntityUpdateRequest'
import EditableEntityContext from '../EditableEntityContext'
import useEntityDefinitionImperativeHandle, {EntityDefinition} from '../useEntityDefinitionImperativeHandle'

const LocalEntityProvider = forwardRef<EntityDefinition, LocalEntityProviderProps>((props, ref) => {
    const {entity, sourceKey = '', updateKey, deleteKey, children, updateEntity} = props

    const settings: EditableEntitySettings = useMemo(() => ({
        type: UpdateMethodType.LOCAL_UPDATE,
        onEntityUpdate: updateEntity,
        sourceKey, updateKey, deleteKey, entity,
    }), [updateEntity, sourceKey, updateKey, deleteKey, entity])


    const exposedEntity = toKey(sourceKey).getFrom(entity)
    const {isPrepared, fieldRefs, registerFieldDefinition, unregisterFieldDefinition} = useEntityFieldDefinitions(settings)
    const contextValue: EditableEntityContextValue<any> = useMemo(() => ({
        entity: exposedEntity,
        updateEntity: ((updateRequest: AEntityUpdateRequest<any>) => {
            updateRequest.setBaseKeys(sourceKey, updateKey, deleteKey)
            return updateRequest.performLocalUpdate(entity, updateEntity)
        }),
        settings, registerFieldDefinition, unregisterFieldDefinition
    }), [exposedEntity,
        sourceKey, updateKey, deleteKey,
        entity, updateEntity,
        settings, registerFieldDefinition, unregisterFieldDefinition
    ])

    useEntityDefinitionImperativeHandle({isPrepared, fieldRefs}, ref)

    return (
        <EditableEntityContext.Provider value={contextValue}>
            {children}
        </EditableEntityContext.Provider>
    )
})

export default memo(LocalEntityProvider)
