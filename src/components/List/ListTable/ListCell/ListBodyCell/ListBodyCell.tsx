import React, {memo, useContext} from 'react'
import {ListBodyCellProps, ListCellRenderer} from '../types'
import TableCell from '@material-ui/core/TableCell'
import {IdentifiableEntity} from '../../../../../api/types'
import TableRowEntityContext, {ListTableRowEntityContextValue} from '../../ListTableBody/TableRowEntityContext'
import $ from '@bast1oncz/strings/dist/classString'
import cls from './ListBodyCell.scss'
import {toKey} from '@bast1oncz/objects/dist/ObjectPathKey'

const defaultRenderer: ListCellRenderer<IdentifiableEntity> = (value) => value

function ListBodyCell<E extends IdentifiableEntity>(props: ListBodyCellProps<E>) {
  const {sourceKey, children: renderer = defaultRenderer} = props
  
  const {entity, detailUrl} = useContext(TableRowEntityContext) as ListTableRowEntityContextValue<E>
  
  const value = toKey(sourceKey).getFrom(entity)
  // TODO: implement redirecting
  return (
    <TableCell className={$(detailUrl && cls.withRedirect)} onClick={undefined}>
      {renderer(value, entity)}
    </TableCell>
  )
}

export default memo(ListBodyCell)
