import {IdentifiableEntity} from '../../../../api/types'
import {FieldReference} from '../../../../logic/fieldReferences'
import {ReactElement} from 'react'

export type ListCellElement<E extends IdentifiableEntity> = ReactElement<ListCellProps<E>>

export interface ListCellProps<E extends IdentifiableEntity> extends ListHeadCellProps, ListBodyCellProps<E> {
  hidden?: boolean
}

export interface ListHeadCellProps {
  label: string
}

export interface ListBodyCellProps<E extends IdentifiableEntity> {
  sourceKey: FieldReference
  /**
   * Can be used for alternative rendering
   *
   * @param value
   * @param entity
   */
  children?: ListCellRenderer<E>
}

export type ListCellRenderer<E extends IdentifiableEntity> = (value: any, entity: E) => ListCellElement<E>
