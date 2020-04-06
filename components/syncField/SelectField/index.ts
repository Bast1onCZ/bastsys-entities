import SelectField, {SelectFieldProps} from './SelectField'
import withTranslatedField from '../withTranslatedField'

export const TranslatedSelectField = withTranslatedField<SelectFieldProps>(SelectField)
export default SelectField
export {SelectOption} from '../../../hooks/entityField/useSelectField'
