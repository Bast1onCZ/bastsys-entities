import SelectField, {SelectFieldProps} from './SelectField'
import withTranslatedField from '../withTranslatedField'

export {SelectOption} from './SelectField'
export const TranslatedSelectField = withTranslatedField<SelectFieldProps>(SelectField)
export default SelectField
