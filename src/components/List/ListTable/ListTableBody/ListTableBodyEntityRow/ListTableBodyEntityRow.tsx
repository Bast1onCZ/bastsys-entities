import React, {memo, useMemo} from 'react'
import {ListTableBodyEntityRowProps} from './types'
import {IdentifiableEntity} from '../../../../../api/types'
import TableRow from '@material-ui/core/TableRow'
import TableRowEntityContext, {ListTableRowEntityContextValue} from '../TableRowEntityContext'
import cls from './ListTableBodyEntityRow.scss'

function ListTableBodyEntityRow<E extends IdentifiableEntity>(props: ListTableBodyEntityRowProps<E>) {
  const {children, entity, detailUrl} = props
  
  const contextValue: ListTableRowEntityContextValue<E> = useMemo(() => ({entity, detailUrl}), [entity, detailUrl])
  
  return (
    <TableRowEntityContext.Provider value={contextValue}>
      <TableRow className={cls.animatedRow}>
        {children}
      </TableRow>
    </TableRowEntityContext.Provider>
  )
}

export default memo(ListTableBodyEntityRow)
