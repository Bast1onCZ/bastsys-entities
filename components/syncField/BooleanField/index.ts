import BooleanField, {BooleanFieldProps} from './BooleanField'
import withTranslatedField from '../withTranslatedField'

export const TranslatedBooleanField = withTranslatedField<BooleanFieldProps>(BooleanField)
export default BooleanField
