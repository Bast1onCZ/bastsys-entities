import DateTimeField, {DateTimeFieldProps} from './DateTimeField'
import withTranslatedField from '../withTranslatedField'

export const TranslatedDateTimeField = withTranslatedField<DateTimeFieldProps>(DateTimeField)
export default DateTimeField
