import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import ImageMimeType from './ImageMimeType'

export interface ImageFieldProps extends SyncFieldDefinition {
  label?: string
  mimeTypes?: ImageMimeType[]
  deletable?: boolean
  hidden?: boolean
  disabled?: boolean
  /**
   * Image shown when no image is selected
   */
  placeholder?: string
}
