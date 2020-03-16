import HtmlField from './HtmlField'
import withTranslatedField from '../withTranslatedField'
import {HtmlFieldProps} from './types'

export const TranslatedHtmlField = withTranslatedField<HtmlFieldProps>(HtmlField)
export default HtmlField
