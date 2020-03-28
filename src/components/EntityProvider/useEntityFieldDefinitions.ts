import {useCallback, useContext, useMemo, useRef} from 'react'
import {SyncFieldReference} from './useSyncFieldImperativeHandle'
import {EntityFieldKeyDefinition} from '../../logic/fieldReferences'
import EditableEntityContext, {EntitySettings} from './EntityContext'
import {joinKeys} from '@bast1oncz/objects/ObjectPathKey'
import changeObject from '@bast1oncz/objects/changeObject'
import values from 'lodash/values'
import useForceUpdate from '@bast1oncz/state/dist/useForceUpdate'

export interface EntityFieldReferences {
  [index: string]: SyncFieldReference
}

export interface EntityFieldDefinitionsHookResult {
  isPrepared: boolean
  fieldRefs: SyncFieldReference[]
  registerFieldDefinition: (def: SyncFieldReference) => void
  unregisterFieldDefinition: (def: SyncFieldReference) => void
}

/**
 * Use this hook only inside entity provider
 *
 * @param settings
 */
export default function useEntityFieldDefinitions<T extends EntityFieldKeyDefinition>(settings: EntitySettings<any>): EntityFieldDefinitionsHookResult {
  const parentCtx = useContext(EditableEntityContext)
  const {registerFieldDefinition: parentRegister, unregisterFieldDefinition: parentUnregister, settings: parentSettings} = parentCtx || {}
  const shouldRegisterToParent = parentSettings?.entity === settings.entity
  
  const fieldRefsRef = useRef<EntityFieldReferences>({})
  const forceUpdate = useForceUpdate()
  
  const setFieldRefs = useCallback(fieldRefs => {
    fieldRefsRef.current = fieldRefs
    forceUpdate()
  }, [])
  
  const createRefForParent = useCallback((ref: SyncFieldReference) => ({
    ...ref,
    sourceKey: joinKeys(settings.sourceKey, ref.sourceKey),
    updateKey: ref.updateKey && joinKeys(settings.updateKey || settings.sourceKey, ref.updateKey),
    deleteKey: ref.deleteKey && joinKeys(settings.deleteKey || settings.updateKey || settings.sourceKey, ref.deleteKey)
  }), [settings.sourceKey, settings.updateKey, settings.deleteKey])
  const registerFieldDefinition = useCallback((ref: SyncFieldReference) => {
    setFieldRefs(
      changeObject(fieldRefsRef.current, {
        [ref.sourceKey.toString()]: ref
      })
    )
    if (shouldRegisterToParent) {
      parentRegister && parentRegister(createRefForParent(ref))
    }
  }, [shouldRegisterToParent, parentRegister, parentUnregister, createRefForParent])
  const unregisterFieldDefinition = useCallback((ref: SyncFieldReference) => {
    setFieldRefs(
      changeObject(fieldRefsRef.current, {
        [ref.sourceKey.toString()]: undefined
      })
    )
    if (shouldRegisterToParent) {
      parentUnregister && parentUnregister(createRefForParent(ref))
    }
  }, [shouldRegisterToParent, parentRegister, parentUnregister, createRefForParent])
  
  const fieldRefsArray = useMemo(() => values(fieldRefsRef.current), [fieldRefsRef.current])
  
  return {
    isPrepared: fieldRefsArray.length > 0,
    registerFieldDefinition,
    unregisterFieldDefinition,
    fieldRefs: fieldRefsArray
  }
}
