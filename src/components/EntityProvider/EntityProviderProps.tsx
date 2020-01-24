import React, {memo} from 'react'
import {EntityProviderProps} from 'components/EntityProvider/types'
import {isLocalEntityProviderProps} from 'components/EntityProvider/LocalEntityProvider/types'
import LocalEntityProvider from 'components/EntityProvider/LocalEntityProvider/LocalEntityProvider'
import {isGraphQLEntityProviderProps} from 'components/EntityProvider/GraphQLEntityProvider/types'
import GraphQLEntityProvider from 'components/EntityProvider/GraphQLEntityProvider/GraphQLEntityProvider'
import NotImplementedError from '@bast1oncz/objects/dist/error/NotImplementedError'

function EntityProviderProps(props: EntityProviderProps) {
    if(isLocalEntityProviderProps(props)) {
        return (
            <LocalEntityProvider {...props} />
        )
    }
    if(isGraphQLEntityProviderProps(props)) {
        return (
            <GraphQLEntityProvider {...props} />
        )
    }
    throw new NotImplementedError()
}

export default memo(EntityProviderProps)
