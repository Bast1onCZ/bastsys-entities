import React, {forwardRef, memo, useMemo} from 'react'
import {ReadonlyEntityProviderProps} from './types'
import EditableEntityContext, {EditableEntityContextValue, EditableEntitySettings} from '../EditableEntityContext'
import {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import NotImplementedError from '@bast1oncz/objects/dist/error/NotImplementedError'
import useEntityFieldDefinitions from '../useEntityFieldDefinitions'
import UpdateMethodType from '../UpdateMethodType'
import useEntityDefinitionImperativeHandle, {EntityDefinition} from '../useEntityDefinitionImperativeHandle'

const ReadonlyEntityProvider = forwardRef<EntityDefinition, ReadonlyEntityProviderProps>((props, ref) => {
    const {entity, sourceKey = '', children} = props

    const exposedEntity = useMemo(() => toKey(sourceKey || '').getFrom(entity), [sourceKey, entity])

    const settings: EditableEntitySettings<any> = useMemo(() => ({
        type: UpdateMethodType.READ_ONLY,
        onEntityUpdate: () => {
            new NotImplementedError()
        },
        sourceKey, entity,
    }), [sourceKey, entity])
    const {isPrepared, fieldRefs, registerFieldDefinition, unregisterFieldDefinition} = useEntityFieldDefinitions(settings)

    const ctxValue = useMemo<EditableEntityContextValue<any>>(() => {
        return {
            entity: exposedEntity,
            updateEntity: () => {
                throw new NotImplementedError()
            },
            isSyncing: false,
            settings,
            registerFieldDefinition,
            unregisterFieldDefinition
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
