import {Translatable} from '../api/types'

export default function getTranslation(translatable: Translatable, fieldName: string, shownLanguageCode: string) {
    return (
        translatable.translations?.find(translation => translation.locale === shownLanguageCode)?.[fieldName] || // found translation in exact locale
        translatable[fieldName] || // found api translated value
        translatable.translations?.find(translation => translation[fieldName])?.[fieldName] // found first filled value
    )
}
