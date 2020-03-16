import RoundingNumericField from './RoundingNumericField'
import withTranslatedField from '../withTranslatedField'
import {RoundingNumericSyncFieldProps} from './types'

export const TranslatedRoundingNumericField = withTranslatedField<RoundingNumericSyncFieldProps>(RoundingNumericField)
export default RoundingNumericField
