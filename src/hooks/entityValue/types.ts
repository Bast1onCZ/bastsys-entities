import {ReactChild} from 'react'
import {EntityFieldKeyDefinition} from 'logic/fieldReferences'
import {ValidatorFunction} from 'hooks/useValidation'

export interface SyncFieldDefinition extends EntityFieldKeyDefinition {
  label?: ReactChild
  validate?: ValidatorFunction
}
