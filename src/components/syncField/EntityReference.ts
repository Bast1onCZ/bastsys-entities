import {Entity} from '../../api/types'

type EntityReferenceFunction<E extends Entity, R> = (entity: E) => R

export type ReferableValue<T> = T | EntityReference<Entity, T>

export interface EntityReference<E = Entity, R = any> {
  getValue: (entity: E) => R
}
export function isEntityReference(value: any): value is EntityReference {
  return typeof value === 'object' && typeof value.getValue === 'function'
}

export class InlineEntityReference<E = Entity, R = any> implements EntityReference<E, R> {
  private fn: EntityReferenceFunction<E, R>

  constructor(fn: EntityReferenceFunction<E, R>) {
    this.fn = fn
  }

  public getValue(entity: E): R {
    return this.fn(entity)
  }
}
