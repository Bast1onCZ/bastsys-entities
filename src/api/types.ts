import {DocumentNode} from 'graphql'

/**
 * Represents an unique ID made of 32 characters
 */
export type Uuid = string

/**
 * Represents an entity with Uuid
 */
export interface IdentifiableEntity {
    id: Uuid
}

/**
 * Represents an entity that must not have id
 */
export interface UnidentifiableEntity {

}

export type Entity = IdentifiableEntity|UnidentifiableEntity

export interface Translatable<T extends Translation = Translation> {
    translations: [T]
}
export interface Translation {
    locale: string
    [field: string]: string
}

export type Query = DocumentNode
export type Mutation = DocumentNode
export type Fragment = DocumentNode
