import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import {IdentifiableEntity} from '../../../api/types'
import SmartButton from '@bast1oncz/components/dist/components/SmartButton'
import UpdateMethodType from '../../EntityProvider/UpdateMethodType'
import {DragInfo, ItemListSyncFieldProps} from './types'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/DeleteOutline'
import useResettableState from '@bast1oncz/state/dist/useResettableState'
import useTempValue from '../../../hooks/useTempValue'
import NotImplementedError from '@bast1oncz/objects/dist/error/NotImplementedError'
import {joinKeys, toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import EntityAddArrayItemRequest from '../../../logic/updateRequest/EntityAddArrayItemRequest'
import EntityDeleteArrayItemRequest from '../../../logic/updateRequest/EntityDeleteArrayItemRequest'
import EntitySetOrderRequest from '../../../logic/updateRequest/EntitySetOrderRequest'
import React, {cloneElement, forwardRef, memo, useCallback, useRef} from 'react'
import {ReactSortable} from 'react-sortablejs'
import $ from '@bast1oncz/strings/dist/classString'
import {SyncFieldElement} from '../types'
import {makeStyles} from '@material-ui/styles'
import {useEntityContext} from '../../EntityProvider/EntityContext'
import {EntityProviderReference} from '../../EntityProvider'
import useValidEntityListener from '../../EntityProvider/useValidEntityListener'
import EntityProvider from '../../EntityProvider/EntityProvider'

const useCls = makeStyles((theme: any) => ({
    row: {
        transition: 'all 0.3s ease',
    },
    active: {
        background: theme.palette.secondary.light
    },
    draggable: {
        cursor: 'pointer'
    }
}))

const SortableTableBody = forwardRef((props, ref) => {
    return (<TableBody {...props} ref={ref}/>)
})

const ItemListField = ((props: ItemListSyncFieldProps) => {
    const {label, disabled, children, orderable} = props
    const cls = useCls()

    const sourceKey = toKey(props.sourceKey)
    const updateKey = toKey(props.updateKey || sourceKey)
    const deleteKey = toKey(props.deleteKey || updateKey)
    const itemIdSourceKey = toKey(props.itemIdSourceKey || 'id')

    const {entity, updateEntity, settings} = useEntityContext()
    const [orderChangeAwaitingItems, setOrderChangeAwaitingItems, resetOrderChangeAwaitingItems] = useResettableState<IdentifiableEntity[] | null>(null)
    const items: IdentifiableEntity[] = orderChangeAwaitingItems || sourceKey.getFrom(entity) || []

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
                itemSourceKey.pushObjectKeyPointer(oldIndex)
                itemUpdateKey.pushObjectKeyPointer(oldIndex)
                break
            case UpdateMethodType.GRAPHQL_UPDATE:
                const id = (items[oldIndex] as IdentifiableEntity).id
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
        setOrderChangeAwaitingItems(expectedMoveResult)
        promise.finally(resetOrderChangeAwaitingItems)
    }, [items, updateEntity, sourceKey.toString(), updateKey.toString(), settings.type, isSyncingOrder])

    // Removing - existing items
    const [removingItemId, setRemovingItemId, resetRemovingItemId] = useResettableState(null)
    const isRemoving = !!removingItemId
    const removeItem = useCallback(item => {
        const id = itemIdSourceKey.getFrom(item)
        const identity = itemIdSourceKey.setAt({}, id)

        const promise = updateEntity(
            new EntityDeleteArrayItemRequest({sourceKey, deleteKey, itemIdentity: identity})
        )
        if (promise) {
            setRemovingItemId(id)
            promise.finally(resetRemovingItemId)
        }
    }, [updateEntity])

    // Creating - temp item
    const {
        tempValue: tempItem, setTempValue: setTempItem, resetTempValue: resetTempItem, isActive: tempItemActive
    } = useTempValue(`The last value of ${label || 'list of entities'} will be lost`)
    const activateTempItem = useCallback(() => setTempItem({}), [])
    const changeTempItem = useCallback(newTempEntity => {
        setTempItem(newTempEntity)
    }, [])

    const [tempItemCreating, setTempItemCreating, resetTempItemCreating] = useResettableState(false)
    const tempItemEntityRef = useRef<EntityProviderReference>({fieldRefs: [], isValid: true, isPrepared: false})
    const tempItemCreate = useCallback(() => {
        const request = new EntityAddArrayItemRequest({
            sourceKey,
            updateKey,
            deleteKey,
            itemFieldDefinitions: tempItemEntityRef.current.fieldRefs
        }, tempItem)
        setTempItemCreating(true)
        const promise = updateEntity(request) || new Promise(resolve => resolve())
        promise
            .then(resetTempItem)
            .finally(resetTempItemCreating)
    }, [sourceKey, updateKey, deleteKey, tempItem])
    useValidEntityListener(tempItemEntityRef, tempItemCreate, !tempItemActive || tempItemCreating)

    const isSyncing = isSyncingOrder || isRemoving || tempItemCreating

    return (
        <div>
            {label &&
            <Typography variant="h5">
                {label}
            </Typography>
            }
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {React.Children.map(children, (child: SyncFieldElement, i) =>
                            <TableCell key={i}>
                                {child.props.label}
                            </TableCell>
                        )}
                        <TableCell padding="checkbox"/>
                    </TableRow>
                </TableHead>
                <ReactSortable
                    key={isSyncing.toString()} // TODO: remove this key as soon as change is implemented by plugin creator
                    tag={SortableTableBody}
                    list={items}
                    onChange={handleOrderDragChange}
                    setList={handleOrderDragConfirm}
                    disabled={!orderable || isSyncing}
                    ghostClass={cls.active}
                >
                    {/* Items */}
                    {items.map((item, i) => {
                        const id = itemIdSourceKey.getFrom(item)

                        const itemKey = sourceKey.clone()
                        if (settings.type === UpdateMethodType.LOCAL_UPDATE) {
                            itemKey.pushObjectKeyPointer(i)
                        } else if (settings.type === UpdateMethodType.GRAPHQL_UPDATE) {
                            itemKey.pushArrayObjectIdentityPointer({id: item.id})
                        }

                        return (
                            <TableRow key={i} className={$(cls.row, orderable && cls.draggable)}>
                                <EntityProvider
                                    {...settings}
                                    sourceKey={joinKeys(settings.sourceKey, itemKey)}
                                    updateKey={settings.updateKey && joinKeys(settings.updateKey, itemKey)}
                                    deleteKey={settings.deleteKey && joinKeys(settings.deleteKey, itemKey)}
                                >
                                    {React.Children.map(children, (child: SyncFieldElement, i) => {
                                        return (
                                            <TableCell key={i}>
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
                {/* Temp item row */}
                <TableFooter>
                    <TableRow>
                        {tempItem !== undefined ? (
                            <EntityProvider
                                ref={tempItemEntityRef}
                                type={UpdateMethodType.LOCAL_UPDATE}
                                entity={tempItem}
                                updateEntity={changeTempItem}
                            >
                                {React.Children.map(children, (child: SyncFieldElement, i) => {
                                    return (
                                        <TableCell key={i}>
                                            {cloneElement(child, {label: undefined})}
                                        </TableCell>
                                    )
                                })}
                            </EntityProvider>
                        ) : React.Children.map(children, (child, i) => (
                            <TableCell key={i}/>
                        ))
                        }
                        <TableCell padding="checkbox">
                            {!tempItemActive ? (
                                <SmartButton type="icon" disabled={disabled || isSyncing} onClick={activateTempItem}>
                                    <AddIcon/>
                                </SmartButton>
                            ) : (
                                <SmartButton type="icon" loading={tempItemCreating} disabled={disabled}
                                             onClick={resetTempItem}>
                                    <RemoveIcon/>
                                </SmartButton>
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
})

export default memo(ItemListField)
