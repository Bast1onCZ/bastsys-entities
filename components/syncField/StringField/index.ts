import StringField, {StringFieldProps} from './StringField'
import withTranslatedField from '../withTranslatedField'

export {StringFieldProps} from './StringField'
export const TranslatedStringField = withTranslatedField<StringFieldProps>(StringField)
export default StringField
