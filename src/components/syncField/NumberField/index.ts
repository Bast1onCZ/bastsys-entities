import NumberSyncField from './NumberField'
import withTranslatedField from '../withTranslatedField'

export {getPriceFormat} from './FormatSettings'
export const TranslatedNumberField = withTranslatedField(NumberSyncField)
export default NumberSyncField
