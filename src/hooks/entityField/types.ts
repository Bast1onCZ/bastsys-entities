import {ReactChild} from 'react'
import {EntityFieldKeyDefinition} from '../../logic/fieldReferences'
import {ValidatorFunction} from '../useValidation'
import {ReferableValue} from '../../components/syncField/EntityReference'

export interface SyncFieldDefinition extends EntityFieldKeyDefinition {
  label?: ReactChild
  validate?: ReferableValue<ValidatorFunction>
}

export interface UseSyncField<T> {
  value: T
  isSyncing: boolean
  confirmChange: ((value: T) => void|Promise<unknown>) | ((value?: T) => void|Promise<unknown>)
}
