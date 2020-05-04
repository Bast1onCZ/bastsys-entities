import React, {memo, Ref} from 'react'
import TableBody from '@material-ui/core/TableBody'
import {SortableContainer} from 'react-sortable-hoc'
import {ItemSubEntity} from '../types'
import {SyncFieldElement} from '../../types'
import SortableItem from './SortableItem'
import ObjectPathKey from '@bast1oncz/objects/ObjectPathKey'

export interface SortableBodyProps {
    tableBodyRef: Ref<any>
    fieldSourceKey: ObjectPathKey
    items: ItemSubEntity[]
    syncingItemId?: string
    disabled: boolean
    removeItem: (item: ItemSubEntity) => void
    orderable?: boolean
    children: SyncFieldElement | SyncFieldElement[]
}

const SortableBody = SortableContainer((props: SortableBodyProps) => {
    const {tableBodyRef, fieldSourceKey, items, disabled, syncingItemId, removeItem, orderable, children} = props

    return (
        <TableBody ref={tableBodyRef}>
            {items.map((item, i) => {
                return (
                    <SortableItem
                        key={item.id}
                        index={i}
                        itemIndex={i}
                        item={item}
                        isSyncing={syncingItemId === item.id}
                        disabled={disabled}
                        disableActions={disabled}
                        fieldSourceKey={fieldSourceKey}
                        removeItem={removeItem}
                        orderable={orderable}
                    >
                        {children}
                    </SortableItem>
                )
            })}
        </TableBody>
    )
})

export default memo(SortableBody)
