import RoundingNumericField, {RoundingNumericSyncFieldProps} from './RoundingNumericField'
import withTranslatedField from '../withTranslatedField'

export const TranslatedRoundingNumericField = withTranslatedField<RoundingNumericSyncFieldProps>(RoundingNumericField)
export default RoundingNumericField
