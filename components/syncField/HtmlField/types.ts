import {SyncFieldDefinition} from '../../../hooks/entityField/types'

export interface HtmlFieldProps extends SyncFieldDefinition {
  label?: string
  disabled?: boolean
  /**
   * Variables that are shown above the editor and user can copy & paste them
   */
  variables?: string[]
  hidden?: boolean
}
