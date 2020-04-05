import React, {memo, ReactElement, useEffect} from 'react'
import {SyncFieldDefinition} from '../../hooks/entityField/types'
import UpdateMethodType from '../EntityProvider/UpdateMethodType'
import EntityProvider from '../EntityProvider'
import {useListContext} from '../List/ListContext'

export interface FilterProps {
    name: string
    children: ReactElement<SyncFieldDefinition> | ReactElement<SyncFieldDefinition>[]
}

function Filter(props: FilterProps) {
    const {children} = props
    
    const {filter, setFilter} = useListContext()

    return (
        <EntityProvider type={UpdateMethodType.LOCAL_UPDATE} entity={filter} updateEntity={setFilter}>
            {children}
        </EntityProvider>
    )
}

export default memo(Filter)
