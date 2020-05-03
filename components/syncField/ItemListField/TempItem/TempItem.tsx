import {EntityProviderReference} from '../../../EntityProvider'
import React, {cloneElement, forwardRef, memo, useCallback, useImperativeHandle, useRef} from 'react'
import TableRow from '@material-ui/core/TableRow'
import EntityProvider from '../../../EntityProvider/EntityProvider'
import UpdateMethodType from '../../../EntityProvider/UpdateMethodType'
import {SyncFieldElement} from '../../types'
import TableCell from '@material-ui/core/TableCell/TableCell'
import SmartButton from '@bast1oncz/components/components/SmartButton'
import AddIcon from '@material-ui/icons/Add'
import TableFooter from '@material-ui/core/TableFooter'
import RemoveIcon from '@material-ui/icons/DeleteOutline'
import useTempValue from '../../../../hooks/useTempValue'
import useResettableState from '@bast1oncz/state/useResettableState'
import EntityAddArrayItemRequest from '../../../../logic/updateRequest/EntityAddArrayItemRequest'
import useValidEntityListener from '../../../EntityProvider/useValidEntityListener'
import ObjectPathKey from '@bast1oncz/objects/ObjectPathKey'
import {useEntityContext} from '../../../EntityProvider/EntityContext'

export interface TempItemProps {
    label?: string
    sourceKey: ObjectPathKey
    updateKey: ObjectPathKey
    deleteKey: ObjectPathKey
    disabled: boolean
    isSyncing: boolean
    children: SyncFieldElement | SyncFieldElement[]
}

export interface TempItemRef {
    isCreating: boolean
}

const TempItem = forwardRef<TempItemRef, TempItemProps>((props, ref) => {
    const {label, sourceKey, updateKey, deleteKey, disabled, isSyncing, children} = props

    const {updateEntity} = useEntityContext()

    const {
        tempValue: tempItem, setTempValue: setTempItem, resetTempValue: resetTempItem, isActive: tempItemActive
    } = useTempValue<object>(`The last value of ${label || 'list of entities'} will be lost`)
    const activateTempItem = useCallback(() => setTempItem({}), [])
    const changeTempItem = useCallback(newTempEntity => {
        setTempItem(newTempEntity)
    }, [])

    const [tempItemCreating, setTempItemCreating, resetTempItemCreating] = useResettableState(false)
    const tempItemEntityRef = useRef<EntityProviderReference>({fieldRefs: [], isValid: true, isPrepared: false})
    const tempItemCreate = useCallback(() => {
        if(tempItem !== undefined) {
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
        }
    }, [sourceKey, updateKey, deleteKey, tempItem])
    useValidEntityListener(tempItemEntityRef, tempItemCreate, !tempItemActive || tempItemCreating)

    useImperativeHandle(ref, () => ({
        isCreating: tempItemCreating
    }), [tempItemCreating])

    return (
        <TableFooter>
            <TableRow>
                {tempItem !== undefined ? (
                    <EntityProvider
                        ref={tempItemEntityRef}
                        type={UpdateMethodType.LOCAL_UPDATE}
                        entity={tempItem}
                        updateEntity={changeTempItem}
                    >
                        {React.Children.map(children, (child: SyncFieldElement) => {
                            return (
                                <TableCell key={child.props.sourceKey.toString()}>
                                    {cloneElement(child, {label: undefined})}
                                </TableCell>
                            )
                        })}
                    </EntityProvider>
                ) : React.Children.map(children, (child, i) => (
                    <TableCell key={i}/>
                ))
                }
                <TableCell padding="checkbox" size="small">
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
    )
})

export default memo(TempItem)
