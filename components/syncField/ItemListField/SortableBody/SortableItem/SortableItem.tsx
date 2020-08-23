import React, {cloneElement, CSSProperties, memo, useCallback, useMemo} from 'react'
import {SortableElement, SortableHandle} from 'react-sortable-hoc'
import TableRow from '@material-ui/core/TableRow'
import {SyncFieldElement} from '../../../types'
import EntityProvider from '../../../../EntityProvider/EntityProvider'
import ObjectPathKey, {joinKeys} from '@bast1oncz/objects/ObjectPathKey'
import TableCell from '@material-ui/core/TableCell/TableCell'
import SmartButton from '@bast1oncz/components/components/SmartButton'
import RemoveIcon from '@material-ui/icons/Delete'
import {ItemSubEntity} from '../../types'
import {useEntityContext} from '../../../../EntityProvider/EntityContext'
import UpdateMethodType from '../../../../EntityProvider/UpdateMethodType'
import MoveIcon from '@material-ui/icons/OpenWith'

export interface SortableItemProps {
    item: ItemSubEntity
    /**
     * List field sourceKey pointing to an array
     */
    fieldSourceKey: ObjectPathKey
    disableActions: boolean
    isSyncing: boolean
    itemIndex: number
    removeItem: (item: ItemSubEntity) => void
    indexable?: boolean
    children: SyncFieldElement | SyncFieldElement[]
}

const fieldCellStyle: CSSProperties = {
    verticalAlign: 'top !important'
}

const Handle = SortableHandle(({disabled}) => {
    return (
        <TableCell padding="checkbox" size="small">
            <SmartButton
                disabled={disabled}
                type="icon"
                size="small"
            >
                <MoveIcon fontSize="small"/>
            </SmartButton>
        </TableCell>
    )
})

const SortableItem = SortableElement((props: SortableItemProps) => {
    const {item, fieldSourceKey, disableActions, itemIndex, isSyncing, removeItem, indexable, children} = props

    const {settings} = useEntityContext()

    const itemKey = useMemo(() => {
        const itemKey = fieldSourceKey.clone()
        if (settings.type === UpdateMethodType.LOCAL_UPDATE) {
            itemKey.pushArrayIndexPointer(itemIndex)
        } else {
            itemKey.pushArrayObjectIdentityPointer({id: item.id})
        }
        return itemKey
    }, [settings.type, fieldSourceKey, itemIndex, item.id])

    const sourceKey = useMemo(() => joinKeys(settings.sourceKey, itemKey), [settings.sourceKey, itemKey])
    const updateKey = useMemo(() => settings.updateKey && joinKeys(settings.updateKey, itemKey), [settings.updateKey, itemKey])
    const deleteKey = useMemo(() => settings.deleteKey && joinKeys(settings.deleteKey, itemKey), [settings.deleteKey, itemKey])

    const handleRemoveItem = useCallback(e => {
        e
        removeItem(item)
    }, [item, removeItem])

    const disableOrderChange = disableActions || settings.readonly

    return (
        <TableRow key={item.id}>
            <EntityProvider
                {...settings}
                sourceKey={sourceKey}
                updateKey={updateKey}
                deleteKey={deleteKey}
                readonly={disableActions || settings.readonly || isSyncing}
            >
                {React.Children.map(children, (child: SyncFieldElement) => {
                    return (
                        <TableCell key={itemKey.toString()} style={fieldCellStyle} size="small">
                            {cloneElement(child, {label: undefined})}
                        </TableCell>
                    )
                })}
            </EntityProvider>
            {indexable &&
            <Handle disabled={disableOrderChange}/>
            }
            <TableCell padding="checkbox" size="small">
                <SmartButton
                    type="icon"
                    size="small"
                    disabled={disableOrderChange}
                    loading={isSyncing}
                    onClick={handleRemoveItem}
                >
                    <RemoveIcon fontSize="small"/>
                </SmartButton>
            </TableCell>
        </TableRow>
    )
})

export default memo(SortableItem)
