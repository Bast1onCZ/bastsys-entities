import Table from '@material-ui/core/Table'
import Typography from '@material-ui/core/Typography'
import UpdateMethodType from '../../EntityProvider/UpdateMethodType'
import {ItemListSyncFieldProps, ItemSubEntity} from './types'
import useResettableState from '@bast1oncz/state/useResettableState'
import NotImplementedError from '@bast1oncz/objects/error/NotImplementedError'
import EntityDeleteArrayItemRequest from '../../../logic/updateRequest/EntityDeleteArrayItemRequest'
import EntityChangeIndexRequest from '../../../logic/updateRequest/EntitySetIndexRequest'
import React, {memo, useCallback, useMemo, useRef, useState} from 'react'
import {useEntityContext} from '../../EntityProvider/EntityContext'
import Head from './Head'
import TempItem from './TempItem/TempItem'
import useToKey from '../../../hooks/useToKey'
import SortableBody from './SortableBody'
import {SortEndHandler} from 'react-sortable-hoc'

const ItemListField = ((props: ItemListSyncFieldProps) => {
    const {label, disabled = false, children, indexable} = props

    const sourceKey = useToKey(props.sourceKey)
    const updateKey = useToKey(props.updateKey || sourceKey)
    const deleteKey = useToKey(props.deleteKey || updateKey)
    const itemIdSourceKey = useToKey(props.itemIdSourceKey || 'id')

    const {entity, updateEntity, settings} = useEntityContext()
    const [indexChangingItemId, setIndexChangingItemId, resetIndexChangingItemId] = useResettableState<string | null>(null)
    const [indexChangeAwaitingItems, setIndexChangeAwaitingItems, resetIndexChangeAwaitingItems] = useResettableState<ItemSubEntity[] | null>(null)

    const items = useMemo<ItemSubEntity[]>(() => {
        const items: any[] = indexChangeAwaitingItems || sourceKey.getFrom(entity) || []
        return items.map(item => ({
            id: itemIdSourceKey.getFrom(item),
            ...item
        }))
    }, [indexChangeAwaitingItems || sourceKey.getFrom(entity), itemIdSourceKey])

    // Changing index
    const isSyncingIndex = !!indexChangingItemId
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

        const setIndexRequest = new EntityChangeIndexRequest({
            sourceKey: itemSourceKey,
            updateKey: itemUpdateKey
        }, oldIndex, newIndex)
        const expectedMoveResult = setIndexRequest.getExpectedResult(items)

        const promise: Promise<any> = updateEntity(setIndexRequest) || (new Promise(resolve => resolve()))
        setIndexChangingItemId(item.id)
        setIndexChangeAwaitingItems(expectedMoveResult)
        promise
            .finally(resetIndexChangingItemId)
            .finally(resetIndexChangeAwaitingItems)
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
    const isSyncing = isSyncingIndex || isRemoving || tempItemCreating

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
                    syncingItemId={indexChangingItemId || removingItemId || undefined}
                    indexable={indexable}
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
                    indexable={indexable}
                >
                    {props.children}
                </TempItem>
            </Table>
        </div>
    )
})

export default memo(ItemListField)
