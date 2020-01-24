import ObjectPathKey from '@bast1oncz/objects/dist/ObjectPathKey'

export type FieldReference = ObjectPathKey | string
export type FunctionalFieldReference<T> = (translationIdentity: T) => FieldReference

export interface TranslationIdentity {
    locale: string
}

export type TranslatableFieldReference = FunctionalFieldReference<TranslationIdentity>

export function isStaticFieldReference(value: unknown): value is FieldReference {
    return typeof value === 'string' || value instanceof ObjectPathKey
}

export interface EntityFieldKeyDefinition {
    /**
     * - Used to access entity field value
     * - Used to update entity field locally
     */
    sourceKey: FieldReference
    /**
     * - Used to update entity field by graphql
     * - If not defined, sourceKey is considered updateKey
     */
    updateKey?: FieldReference
    /**
     * - Used to delete entity field by graphql
     * - If not defined, updateKey is considered deleteKey
     */
    deleteKey?: FieldReference
}

export function isEntityFieldKeyDefinition(value: any): value is EntityFieldKeyDefinition {
    return typeof value === 'object' &&
        isStaticFieldReference(value?.sourceKey) &&
        (value?.updateKey === undefined || isStaticFieldReference(value?.updateKey)) &&
        (value?.deleteKey === undefined || isStaticFieldReference(value?.deleteKey))
}
