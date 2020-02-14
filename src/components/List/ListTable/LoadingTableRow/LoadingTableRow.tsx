import React, {memo} from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import LinearProgress from '@material-ui/core/LinearProgress'
import {LoadingTableRowProps} from './types'

function LoadingTableRow(props: LoadingTableRowProps) {
  const {columnCount} = props
  
  return (
    <TableRow>
      <TableCell colSpan={columnCount}>
        <LinearProgress color="primary" />
      </TableCell>
    </TableRow>
  )
}

export default memo(LoadingTableRow)
