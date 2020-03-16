import StringField from './StringField'
import withTranslatedField from '../withTranslatedField'

export {StringFieldProps} from './StringField'
export const TranslatedStringField = withTranslatedField(StringField)
export default StringField
