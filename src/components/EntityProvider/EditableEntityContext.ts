import {EntityResponseData} from 'api/generate/generateEntityQuery'
import {Entity, Mutation, UnidentifiableEntity} from 'api/types'
import {createContext} from 'react'
import AEntityUpdateRequest from 'logic/updateRequest/AEntityUpdateRequest'
import UpdateMethodType from 'components/EntityProvider/UpdateMethodType'
import {FieldReference} from 'logic/fieldReferences'
import {SyncFieldReference} from 'components/EntityProvider/useSyncFieldImperativeHandle'

export interface EditableEntityContextValue<E extends Entity> {
  entity: Entity
  updateEntity: (updateRequest: AEntityUpdateRequest<E>) => void|Promise<any>
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
