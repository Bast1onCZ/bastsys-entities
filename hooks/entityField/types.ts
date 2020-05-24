import {ReactChild} from 'react'
import {EntityFieldKeyDefinition} from '../../logic/fieldReferences'
import {ValidatorFunction} from '../useValidation'
import {ReferableValue} from '../../components/syncField/EntityReference'

export interface SyncFieldDefinition extends EntityFieldKeyDefinition {
  label?: ReactChild
  validate?: ReferableValue<ValidatorFunction>
  disabled?: boolean
}

export interface UseSyncField<T, R extends boolean = false> {
  value: T
  isSyncing: boolean
  disabled: boolean
  confirmChange: R extends true ? ((value: T) => void|Promise<unknown>) : ((value?: T) => void|Promise<unknown>)
}
