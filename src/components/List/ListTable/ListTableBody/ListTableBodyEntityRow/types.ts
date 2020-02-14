import {IdentifiableEntity} from '../../../../../api/types'
import {ReactNode} from 'react'

export interface ListTableBodyEntityRowProps<E extends IdentifiableEntity> {
  children: ReactNode
  entity: E
  detailUrl?: string
}
