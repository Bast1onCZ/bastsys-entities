import React, {forwardRef, memo, useMemo} from 'react'
import {ReadonlyEntityProviderProps} from './types'
import EditableEntityContext, {EntityContextValue, EntitySettings} from '../EntityContext'
import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import NotImplementedError from '@bast1oncz/objects/error/NotImplementedError'
import useEntityFieldDefinitions from '../useEntityFieldDefinitions'
import UpdateMethodType from '../UpdateMethodType'
import useEntityDefinitionImperativeHandle, {EntityDefinition} from '../useEntityDefinitionImperativeHandle'

const ReadonlyEntityProvider = forwardRef<EntityDefinition, ReadonlyEntityProviderProps>((props, ref) => {
    const {entity, sourceKey = '', children} = props

    const exposedEntity = useMemo(() => toKey(sourceKey || '').getFrom(entity), [sourceKey, entity])

    const settings: EntitySettings<any> = useMemo(() => ({
        type: UpdateMethodType.READ_ONLY,
        onEntityUpdate: () => {
            new NotImplementedError()
        },
        sourceKey, entity, readonly: true
    }), [sourceKey, entity])
    const {isPrepared, fieldRefs, registerFieldDefinition, unregisterFieldDefinition} = useEntityFieldDefinitions(settings)

    const ctxValue = useMemo<EntityContextValue<any>>(() => {
        return {
            entity: exposedEntity,
            updateEntity: () => {
                throw new NotImplementedError()
            },
            isSyncing: false,
            settings,
            registerFieldDefinition,
            unregisterFieldDefinition,
            readonly: true
        }
    }, [exposedEntity, settings, registerFieldDefinition, unregisterFieldDefinition])

    useEntityDefinitionImperativeHandle({isPrepared, fieldRefs}, ref)

    return (
        <EditableEntityContext.Provider value={ctxValue}>
            {children}
        </EditableEntityContext.Provider>
    )
})

export default memo(ReadonlyEntityProvider)
