import {Entity, Mutation} from '../../api/types'
import AEntityUpdateRequest from '../../logic/updateRequest/AEntityUpdateRequest'
import UpdateMethodType from './UpdateMethodType'
import {FieldReference} from '../../logic/fieldReferences'
import {SyncFieldReference} from './useSyncFieldImperativeHandle'
import prepareContext from '@bast1oncz/components/dist/logic/prepareContext'

export interface EntityContextValue<E extends Entity> {
  entity: E
  updateEntity: (updateRequest: AEntityUpdateRequest<E>) => void|Promise<any>
  isSyncing: boolean
  registerFieldDefinition: (def: SyncFieldReference) => void
  unregisterFieldDefinition: (def: SyncFieldReference) => void
  settings: EntitySettings<E>
}

export interface EntitySettings<E extends Entity> {
  type: UpdateMethodType
  entity: Entity | undefined
  sourceKey: FieldReference
  updateKey?: FieldReference
  deleteKey?: FieldReference
  onEntityUpdate?: (entity: Entity) => void
  updateMutation?: Mutation
  deleteMutation?: Mutation
}

const {context: EditableEntityContext, useContext} = prepareContext<EntityContextValue<any>>('Entity')

export const useEntityContext = useContext
export default EditableEntityContext
