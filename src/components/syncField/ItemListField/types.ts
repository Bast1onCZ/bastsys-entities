import {FieldReference} from '../../../logic/fieldReferences'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import {SyncFieldElement} from '../types'

export interface ItemListSyncFieldProps extends SyncFieldDefinition {
  /**
   * Source of item identity
   *
   * default is 'id'
   */
  itemIdSourceKey?: FieldReference
  disabled?: boolean
  children: SyncFieldElement | SyncFieldElement[]
  orderable?: boolean
}

export interface DragInfo {
  oldIndex: number
  newIndex: number
}
