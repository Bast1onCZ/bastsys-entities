import {createContext} from 'react'
import {Entity, Mutation} from '../../api/types'
import AEntityUpdateRequest from '../../logic/updateRequest/AEntityUpdateRequest'
import UpdateMethodType from './UpdateMethodType'
import {FieldReference} from '../../logic/fieldReferences'
import {SyncFieldReference} from './useSyncFieldImperativeHandle'

export interface EditableEntityContextValue<E extends Entity> {
  entity: Entity
  updateEntity: (updateRequest: AEntityUpdateRequest<E>) => void|Promise<any>
  isSyncing: boolean
  registerFieldDefinition: (def: SyncFieldReference) => void
  unregisterFieldDefinition: (def: SyncFieldReference) => void
  settings: EditableEntitySettings
}

export interface EditableEntitySettings {
  type: UpdateMethodType
  entity: Entity | undefined
  sourceKey: FieldReference
  updateKey?: FieldReference
  deleteKey?: FieldReference
  onEntityUpdate?: (entity: Entity) => void
  updateMutation?: Mutation
  deleteMutation?: Mutation
}

const EditableEntityContext = createContext<EditableEntityContextValue<Entity>|undefined>(undefined)

export default EditableEntityContext
