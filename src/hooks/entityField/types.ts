import {ReactChild} from 'react'
import {EntityFieldKeyDefinition} from '../../logic/fieldReferences'
import {ValidatorFunction} from '../useValidation'

export interface SyncFieldDefinition extends EntityFieldKeyDefinition {
  label?: ReactChild
  validate?: ValidatorFunction
}

export interface UseSyncField<T> {
  value: T
  isSyncing: boolean
  confirmChange: ((value: T) => void|Promise<unknown>) | ((value?: T) => void|Promise<unknown>)
}
