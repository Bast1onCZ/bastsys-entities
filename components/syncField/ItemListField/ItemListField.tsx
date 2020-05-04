import Table from '@material-ui/core/Table'
import TableBody, {TableBodyProps} from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import SmartButton from '@bast1oncz/components/components/SmartButton'
import UpdateMethodType from '../../EntityProvider/UpdateMethodType'
import {DragInfo, ItemListSyncFieldProps, ItemSubEntity} from './types'
import RemoveIcon from '@material-ui/icons/DeleteOutline'
import useResettableState from '@bast1oncz/state/useResettableState'
import NotImplementedError from '@bast1oncz/objects/error/NotImplementedError'
import {joinKeys} from '@bast1oncz/objects/ObjectPathKey'
import EntityDeleteArrayItemRequest from '../../../logic/updateRequest/EntityDeleteArrayItemRequest'
import EntitySetOrderRequest from '../../../logic/updateRequest/EntitySetOrderRequest'
import React, {cloneElement, forwardRef, memo, useCallback, useMemo, useRef, useState} from 'react'
import {ReactSortable} from 'react-sortablejs'
import $ from '@bast1oncz/strings/classString'
import {SyncFieldElement} from '../types'
import {makeStyles} from '@material-ui/styles'
import {useEntityContext} from '../../EntityProvider/EntityContext'
import EntityProvider from '../../EntityProvider/EntityProvider'
import Head from './Head'
import TempItem from './TempItem/TempItem'
import useToKey from '../../../hooks/useToKey'

const useCls = makeStyles((theme: any) => ({
    row: {
        transition: 'all 0.3s ease'
    },
    active: {
        background: theme.palette.primary.light
    },
    draggable: {
        cursor: 'pointer'
    },
    fieldCell: {
        verticalAlign: 'top !important'
    }
}))

const SortableTableBody = forwardRef<any, TableBodyProps>((props, ref) => {
    return (<TableBody {...props} ref={ref}/>)
})

const ItemListField = ((props: ItemListSyncFieldProps) => {
    const {label, disabled = false, children, orderable} = props
    const cls = useCls()

    const sourceKey = useToKey(props.sourceKey)
    const updateKey = useToKey(props.updateKey || sourceKey)
    const deleteKey = useToKey(props.deleteKey || updateKey)
    const itemIdSourceKey = useToKey(props.itemIdSourceKey || 'id')

    const {entity, updateEntity, settings} = useEntityContext()
    const [orderChangeAwaitingItems, setOrderChangeAwaitingItems, resetOrderChangeAwaitingItems] = useResettableState<ItemSubEntity[] | null>(null)

    const items = useMemo<ItemSubEntity[]>(() => {
        const items: any[] = orderChangeAwaitingItems || sourceKey.getFrom(entity) || []
        return items.map(item => ({
            id: itemIdSourceKey.getFrom(item),
            ...item
        }))
    }, [orderChangeAwaitingItems || sourceKey.getFrom(entity), itemIdSourceKey])

    // Changing order
    const isSyncingOrder = !!orderChangeAwaitingItems
    const lastChangeOrderInfo = useRef<DragInfo>()
    const handleOrderDragChange = useCallback(event => {
        lastChangeOrderInfo.current = {
            oldIndex: event.oldIndex,
            newIndex: event.newIndex
        }
    }, [])
    const handleOrderDragConfirm = useCallback(() => {
        if (!lastChangeOrderInfo.current) {
            return // unnecessary confirm calls
        }
        if (isSyncingOrder) {
            return // bug because disabled is not working -_-
        }

        const {oldIndex, newIndex} = lastChangeOrderInfo.current
        const itemSourceKey = sourceKey.clone()
        const itemUpdateKey = updateKey.clone()

        switch (settings.type) {
            case UpdateMethodType.LOCAL_UPDATE:
                itemSourceKey.pushArrayIndexPointer(oldIndex)
                itemUpdateKey.pushArrayIndexPointer(oldIndex)
                break
            case UpdateMethodType.GRAPHQL_UPDATE:
                const id = items[oldIndex].id
                itemSourceKey.pushArrayObjectIdentityPointer({id})
                itemUpdateKey.pushArrayObjectIdentityPointer({id})
                break
            default:
                throw new NotImplementedError()
        }

        const setOrderRequest = new EntitySetOrderRequest({
            sourceKey: itemSourceKey,
            updateKey: itemUpdateKey,

        }, oldIndex, newIndex)
        const expectedMoveResult = setOrderRequest.getExpectedResult(items)

        const promise: Promise<any> = updateEntity(setOrderRequest) || (new Promise(resolve => resolve()))
        setOrderChangeAwaitingItems(expectedMoveResult)
        promise.finally(resetOrderChangeAwaitingItems)
    }, [items, updateEntity, sourceKey.toString(), updateKey.toString(), settings.type, isSyncingOrder])

    // Removing - existing items
    const [removingItemId, setRemovingItemId, resetRemovingItemId] = useResettableState(null)
    const isRemoving = !!removingItemId
    const removeItem = useCallback(item => {
        const {id} = item
        const identity = itemIdSourceKey.setAt({}, id)

        const promise = updateEntity(
            new EntityDeleteArrayItemRequest({sourceKey, deleteKey, itemIdentity: identity})
        )
        if (promise) {
            setRemovingItemId(id)
            promise.finally(resetRemovingItemId)
        }
    }, [updateEntity])

    const [tempItemCreating, setTempItemCreating] = useState(false)
    const isSyncing = isSyncingOrder || isRemoving || tempItemCreating

    return (
        <div>
            {label &&
            <Typography variant="h5">
                {label}
            </Typography>
            }
            <Table size="small">
                {/* Field labels */}
                <Head>
                    {props.children}
                </Head>
                {/* Item fields */}
                <ReactSortable
                    tag={SortableTableBody}
                    list={items}
                    onChange={handleOrderDragChange}
                    setList={handleOrderDragConfirm}
                    disabled={!orderable || isSyncing || disabled}
                    ghostClass={cls.active}
                >
                    {items.map((item, i) => {
                        const {id} = item
                        if (!id) {
                            throw new Error('Item id not defined')
                        }

                        const itemKey = sourceKey.clone()
                            if(settings.type === UpdateMethodType.LOCAL_UPDATE) {
                                itemKey.pushArrayIndexPointer(i)
                            } else {
                                itemKey.pushArrayObjectIdentityPointer({id})
                            }

                        return (
                            <TableRow key={id} className={$(cls.row, orderable && cls.draggable)}>
                                <EntityProvider
                                    {...settings}
                                    sourceKey={joinKeys(settings.sourceKey, itemKey)}
                                    updateKey={settings.updateKey && joinKeys(settings.updateKey, itemKey)}
                                    deleteKey={settings.deleteKey && joinKeys(settings.deleteKey, itemKey)}
                                    readonly={disabled || settings.readonly}
                                >
                                    {React.Children.map(children, (child: SyncFieldElement) => {
                                        return (
                                            <TableCell key={itemKey.toString()} className={cls.fieldCell}>
                                                {cloneElement(child, {label: undefined})}
                                            </TableCell>
                                        )
                                    })}
                                </EntityProvider>
                                <TableCell padding="checkbox">
                                    <SmartButton
                                        type="icon"
                                        disabled={disabled || isSyncing}
                                        loading={(removingItemId && id === removingItemId) || (isSyncingOrder && i === lastChangeOrderInfo.current?.newIndex)}
                                        onClick={() => removeItem(item)}
                                    >
                                        <RemoveIcon/>
                                    </SmartButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </ReactSortable>
                {/* Temp item fields */}
                <TempItem
                    sourceKey={sourceKey}
                    updateKey={updateKey}
                    deleteKey={deleteKey}
                    itemIdSourceKey={itemIdSourceKey}
                    label={label?.toString()}
                    isSyncing={isSyncing}
                    disabled={disabled}
                    tempItemCreating={tempItemCreating}
                    setTempItemCreating={setTempItemCreating}
                >
                    {props.children}
                </TempItem>
            </Table>
        </div>
    )
})

export default memo(ItemListField)
