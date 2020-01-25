import React, {memo} from 'react'
import {EntityProviderProps} from './types'
import {isLocalEntityProviderProps} from './LocalEntityProvider/types'
import LocalEntityProvider from './LocalEntityProvider/LocalEntityProvider'
import {isGraphQLEntityProviderProps} from './GraphQLEntityProvider/types'
import NotImplementedError from '@bast1oncz/objects/dist/error/NotImplementedError'
import GraphQLEntityProvider from './GraphQLEntityProvider/GraphQLEntityProvider'

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
