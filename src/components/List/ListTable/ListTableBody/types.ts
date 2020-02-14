import {IdentifiableEntity} from '../../../../api/types'
import {ReactNode} from 'react'

export interface ListTableBodyProps<E extends IdentifiableEntity> {
  children: ReactNode
}
