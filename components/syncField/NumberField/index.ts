import NumberSyncField, {NumberFieldProps} from './NumberField'
import withTranslatedField from '../withTranslatedField'

export {getPriceFormat} from './FormatSettings'
export const TranslatedNumberField = withTranslatedField<NumberFieldProps>(NumberSyncField)
export default NumberSyncField
