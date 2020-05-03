import React, {memo} from 'react'
import {SyncFieldElement} from '../../types'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

export interface HeadProps {
    children: SyncFieldElement | SyncFieldElement[]
}

function Head(props: HeadProps) {
    return (
        <TableHead>
            <TableRow>
                {React.Children.map(props.children, (syncField: SyncFieldElement) => {
                    return (
                        <TableCell key={syncField.props.sourceKey.toString()}>
                            {syncField.props.label}
                        </TableCell>
                    )
                })}
                <TableCell padding="checkbox" />
            </TableRow>
        </TableHead>
    )
}

export default memo(Head)
