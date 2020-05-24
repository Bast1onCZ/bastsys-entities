import StringListField, {StringListFieldProps} from './StringListField'
import withTranslatedField from '../withTranslatedField'

export const TranslatedStringListField = withTranslatedField<StringListFieldProps>(StringListField)
export default StringListField
