import DateField, {DateFieldProps} from './DateField'
import withTranslatedField from '../withTranslatedField'

export const TranslatedDateField = withTranslatedField<DateFieldProps>(DateField)
export default DateField
