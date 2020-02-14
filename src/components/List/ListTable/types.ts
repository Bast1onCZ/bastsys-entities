import {IdentifiableEntity} from '../../../api/types'
import {ListTableHeadProps} from './ListTableHead/types'
import {ListTableBodyProps} from './ListTableBody/types'

export interface ListTableProps<E extends IdentifiableEntity> extends ListTableHeadProps<E>, ListTableBodyProps<E> {

}
