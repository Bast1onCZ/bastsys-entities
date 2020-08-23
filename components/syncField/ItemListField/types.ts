import {FieldReference} from '../../../logic/fieldReferences'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import {SyncFieldElement} from '../types'
import {IdentifiableEntity} from '../../../api/types'

export interface ItemListSyncFieldProps extends SyncFieldDefinition {
  /**
   * Source of item identity
   *
   * default is 'id'
   */
  itemIdSourceKey?: FieldReference
  disabled?: boolean
  children: SyncFieldElement | SyncFieldElement[]
  indexable?: boolean
}

export interface DragInfo {
  oldIndex: number
  newIndex: number
}

export type ItemSubEntity = IdentifiableEntity
