import {Ref, useContext, useEffect, useImperativeHandle} from 'react'
import {EntityFieldKeyDefinition} from '../../logic/fieldReferences'
import SyncFieldType from '../syncField/syncFieldType'
import {ValidationResult} from '../../hooks/useValidation'
import EditableEntityContext, {EditableEntityContextValue} from './EditableEntityContext'
import {Entity} from '../../api/types'
import values from 'lodash/values'

export interface SyncFieldReference extends EntityFieldKeyDefinition, ValidationResult {
  type: SyncFieldType
}

/**
 * Creates a sync field reference
 *
 * @param ref
 * @param input
 */
export default function useSyncFieldImperativeHandle(ref: Ref<SyncFieldReference>|undefined, input: SyncFieldReference) {
  // Context
  const {sourceKey, updateKey, deleteKey} = input
  
  const editableEntityContext = useContext(EditableEntityContext) as EditableEntityContextValue<Entity>
  useEffect(() => {
      editableEntityContext.registerFieldDefinition(input)
      
      return () => editableEntityContext.unregisterFieldDefinition(input)
  }, [sourceKey.toString(), updateKey?.toString(), deleteKey?.toString(), input.error])
  
  // Reference
  useImperativeHandle<SyncFieldReference, SyncFieldReference>(ref, () => ({
    ...input
  }), [...values(input)])
}
