import {Entity, Translatable} from '../api/types'
import ObjectPathKey, {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import {ValidatorFunction} from '../hooks/useValidation'
import { EntityReference } from '../components/syncField/EntityReference'
import { FieldReference} from '../logic/fieldReferences'
import requiredValidator from './requiredValidator'

export default class AnyTranslationRequiredValidator<E extends Entity> implements EntityReference<E, ValidatorFunction> {
  private translationFieldSourceKey: ObjectPathKey
  private translatableSourceKey: ObjectPathKey
  
  /**
   * @param translatableSourceKey
   * @param translationFieldSourceKey
   */
  constructor(translationFieldSourceKey: FieldReference, translatableSourceKey: FieldReference = '') {
    this.translationFieldSourceKey = toKey(translationFieldSourceKey)
    this.translatableSourceKey = toKey(translatableSourceKey)
  }
  
  /**
   * Gets validator function that already contains its result based on entity structure
   *
   * @param entity
   */
  getValue(entity: E) {
    const translatable: Translatable = toKey(this.translatableSourceKey).getFrom(entity) || {}
    const translationFieldPathKey = toKey(this.translationFieldSourceKey)
    const translations = translatable.translations || []
    const hasTranslatedField = translations.some(translation =>
      !requiredValidator(
        translationFieldPathKey.getFrom(translation)
      )
    )
  
    const result: ValidatorFunction = (value: unknown) => {
      if(!hasTranslatedField && !value) {
        // if entity does not contain the field && temp value is not equal to true
        return "Translation in at least 1 language is required"
      }
    }
    
    return result
  }
}
