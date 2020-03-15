import {Language} from '../../api/types'
import prepareContext from '@bast1oncz/components/dist/logic/prepareContext'

export interface TranslationsContextValue {
    shownLanguageCode: string
    editedLanguageCode: string
    languages: Language[]
}

const {context, useContext} = prepareContext<TranslationsContextValue>('Translations')

export const useTranslationsContext = useContext
export default context
