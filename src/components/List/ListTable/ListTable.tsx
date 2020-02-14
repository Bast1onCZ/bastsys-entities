import React, {memo} from 'react'
import {ListTableProps} from './types'
import Table from '@material-ui/core/Table'
import {IdentifiableEntity} from '../../../api/types'
import ListTableHead from './ListTableHead/ListTableHead'
import ListTableBody from './ListTableBody/ListTableBody'

function ListTable<E extends IdentifiableEntity>(props: ListTableProps<E>) {
    const {children} = props

    return (
        <Table>
            <ListTableHead>
                {children}
            </ListTableHead>
            <ListTableBody>
                {children}
            </ListTableBody>
        </Table>
    )
}

export default memo(ListTable)
