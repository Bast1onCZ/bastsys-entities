import NumberSyncField from './NumberField'
import withTranslatedField from '../withTranslatedField'
import {NumberFieldProps} from './types'

export {getPriceFormat} from './FormatSettings'
export const TranslatedNumberField = withTranslatedField<NumberFieldProps>(NumberSyncField)
export default NumberSyncField
