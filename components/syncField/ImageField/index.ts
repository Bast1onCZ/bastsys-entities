import ImageField from './ImageField'
import withTranslatedField from '../withTranslatedField'
import {ImageFieldProps} from './types'

export const TranslatedImageField = withTranslatedField<ImageFieldProps>(ImageField)
export default ImageField
