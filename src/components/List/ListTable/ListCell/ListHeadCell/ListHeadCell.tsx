import React, {memo} from 'react'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import {ListHeadCellProps} from '../types'
import TableCell from '@material-ui/core/TableCell'

function ListHeadCell(props: ListHeadCellProps) {
  const {label} = props
  
  return (
    <TableCell>
      <TableSortLabel
        // active={!!columnOrderBy}
        // direction={columnOrderBy && columnOrderBy.direction.toLowerCase()}
        // onClick={() => this.handleOrderByChange(key)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  )
}

export default memo(ListHeadCell)
