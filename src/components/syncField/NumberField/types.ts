import {ReferableValue} from '../EntityReference'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import {FormatSettings} from './FormatSettings'

export interface NumberFieldProps extends SyncFieldDefinition {
  label?: string
  disabled?: boolean
  hidden?: boolean
  format?: ReferableValue<FormatSettings | undefined>
}

