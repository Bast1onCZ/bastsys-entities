import {Language} from '../../api/types'
import prepareContext from '@bast1oncz/components/logic/prepareContext'
import {SolidDeep} from '@bast1oncz/objects/types/operations'

export interface TranslationsContextValue {
    shownLanguageCode: string
    editedLanguageCode: string
    languages: SolidDeep<Language>[]
    setShownLanguageCode?: (shownLanguageCode: string) => void
    setEditedLanguageCode?: (editedLanguageCode: string) => void
}

const {context, useContext} = prepareContext<TranslationsContextValue>('Translations')

export const useTranslationsContext = useContext
export default context
