import {createContext} from 'react'
import {IdentifiableEntity} from '../../../../api/types'

export interface ListTableRowEntityContextValue<E extends IdentifiableEntity> {
  entity: E
  detailUrl?: string
}

const TableRowEntityContext = createContext<ListTableRowEntityContextValue<IdentifiableEntity>|null>(null)

export default TableRowEntityContext
