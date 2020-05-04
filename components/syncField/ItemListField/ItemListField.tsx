import Table from '@material-ui/core/Table'
import Typography from '@material-ui/core/Typography'
import UpdateMethodType from '../../EntityProvider/UpdateMethodType'
import {ItemListSyncFieldProps, ItemSubEntity} from './types'
import useResettableState from '@bast1oncz/state/useResettableState'
import NotImplementedError from '@bast1oncz/objects/error/NotImplementedError'
import EntityDeleteArrayItemRequest from '../../../logic/updateRequest/EntityDeleteArrayItemRequest'
import EntitySetOrderRequest from '../../../logic/updateRequest/EntitySetOrderRequest'
import React, {memo, useCallback, useMemo, useRef, useState} from 'react'
import {useEntityContext} from '../../EntityProvider/EntityContext'
import Head from './Head'
import TempItem from './TempItem/TempItem'
import useToKey from '../../../hooks/useToKey'
import SortableBody from './SortableBody'
import {SortEndHandler} from 'react-sortable-hoc'

const ItemListField = ((props: ItemListSyncFieldProps) => {
    const {label, disabled = false, children, orderable} = props

    const sourceKey = useToKey(props.sourceKey)
    const updateKey = useToKey(props.updateKey || sourceKey)
    const deleteKey = useToKey(props.deleteKey || updateKey)
    const itemIdSourceKey = useToKey(props.itemIdSourceKey || 'id')

    const {entity, updateEntity, settings} = useEntityContext()
    const [orderChangingItemId, setOrderChangingItemId, resetOrderChangingItemId] = useResettableState<string | null>(null)
    const [orderChangeAwaitingItems, setOrderChangeAwaitingItems, resetOrderChangeAwaitingItems] = useResettableState<ItemSubEntity[] | null>(null)

    const items = useMemo<ItemSubEntity[]>(() => {
        const items: any[] = orderChangeAwaitingItems || sourceKey.getFrom(entity) || []
        return items.map(item => ({
            id: itemIdSourceKey.getFrom(item),
            ...item
        }))
    }, [orderChangeAwaitingItems || sourceKey.getFrom(entity), itemIdSourceKey])

    // Changing order
    const isSyncingOrder = !!orderChangingItemId
    const handleSortEnd = useCallback<SortEndHandler>(sort => {
        const {oldIndex, newIndex} = sort
        if (oldIndex === newIndex) {
            return
        }

        const item = items[oldIndex]
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
            updateKey: itemUpdateKey
        }, oldIndex, newIndex)
        const expectedMoveResult = setOrderRequest.getExpectedResult(items)

        const promise: Promise<any> = updateEntity(setOrderRequest) || (new Promise(resolve => resolve()))
        setOrderChangingItemId(item.id)
        setOrderChangeAwaitingItems(expectedMoveResult)
        promise
            .finally(resetOrderChangingItemId)
            .finally(resetOrderChangeAwaitingItems)
    }, [entity, items, updateEntity, sourceKey.toString(), updateKey.toString(), settings.type])

    // Removing - existing items
    const [removingItemId, setRemovingItemId, resetRemovingItemId] = useResettableState<string | null>(null)
    const isRemoving = !!removingItemId
    const removeItem = useCallback((item: ItemSubEntity) => {
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

    const tableBodyRef = useRef<HTMLTableSectionElement>(null)

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
                {/* Items */}
                <SortableBody
                    tableBodyRef={tableBodyRef}
                    lockAxis="y"
                    useDragHandle
                    onSortEnd={handleSortEnd}
                    hideSortableGhost
                    lockToContainerEdges
                    helperContainer={() => tableBodyRef.current as HTMLTableSectionElement}

                    fieldSourceKey={sourceKey}
                    items={items}
                    removeItem={removeItem}
                    disabled={disabled || isSyncing}
                    syncingItemId={orderChangingItemId || removingItemId || undefined}
                    orderable={orderable}
                >
                    {children}
                </SortableBody>
                {/* Temp item fields */}
                <TempItem
                    sourceKey={sourceKey}
                    updateKey={updateKey}
                    deleteKey={deleteKey}
                    itemIdSourceKey={itemIdSourceKey}
                    label={label?.toString()}
                    isSyncing={disabled || isSyncing}
                    disabled={disabled}
                    tempItemCreating={tempItemCreating}
                    setTempItemCreating={setTempItemCreating}
                    orderable={orderable}
                >
                    {props.children}
                </TempItem>
            </Table>
        </div>
    )
})

export default memo(ItemListField)
