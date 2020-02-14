import {IdentifiableEntity} from '../../../../api/types'
import {ReactNode} from 'react'

export interface ListTableHeadProps<E extends IdentifiableEntity> {
  children: ReactNode
}
