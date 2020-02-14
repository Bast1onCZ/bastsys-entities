import React, {memo} from 'react'
import ListTableContentTypeContext from '../ListTableContentTypeContext'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import {ListTableHeadProps} from './types'
import {IdentifiableEntity} from '../../../../api/types'

function ListTableHead<E extends IdentifiableEntity>(props: ListTableHeadProps<E>) {
  const {children} = props
  
  return (
    <TableHead>
      <ListTableContentTypeContext.Provider value="head">
        <TableRow>
          {children}
        </TableRow>
      </ListTableContentTypeContext.Provider>
    </TableHead>
  )
}

export default memo(ListTableHead)
