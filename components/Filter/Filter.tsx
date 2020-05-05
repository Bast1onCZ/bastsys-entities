import React, {memo, ReactElement} from 'react'
import {SyncFieldDefinition} from '../../hooks/entityField/types'
import UpdateMethodType from '../EntityProvider/UpdateMethodType'
import EntityProvider from '../EntityProvider'
import {useListContext} from '../List/ListContext'

export interface FilterProps<T> {
    name: string
    /**
     * Used for controlled filter
     */
    filter?: T
    /**
     * Used filter on init
     */
    defaultFilter?: T
    children?: ReactElement<SyncFieldDefinition> | ReactElement<SyncFieldDefinition>[]
}

function Filter<T>(props: FilterProps<T>) {
    const {children} = props
    
    const {filter, setFilter} = useListContext()

    return (
        <EntityProvider type={UpdateMethodType.LOCAL_UPDATE} entity={filter} updateEntity={setFilter}>
            {children}
        </EntityProvider>
    )
}

export default memo(Filter)
