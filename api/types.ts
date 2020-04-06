import {DocumentNode} from 'graphql'

/**
 * Represents an unique ID made of 32 characters
 */
export type Uuid = string

/**
 * Represents an entity with Uuid
 */
export interface IdentifiableEntity {
    id: string|Uuid
}

export function isIdentifiableEntity(value: any): value is IdentifiableEntity {
    return value && typeof value === 'object' && typeof value.id === 'string' && value.id.length > 0
}

/**
 * Represents an entity that must not have id
 */
export interface UnidentifiableEntity {

}

export type Entity = IdentifiableEntity|UnidentifiableEntity

export interface Translatable<T extends Translation = Translation> {
    translations: T[]
}
export interface Translation {
    locale: string
    [field: string]: string
}

export interface Language extends Translatable {
    code: string,
    translations: LanguageTranslation[]
}

interface LanguageTranslation extends Translation {
    name: string
}

export type Query = DocumentNode
export type Mutation = DocumentNode
export type Fragment = DocumentNode
