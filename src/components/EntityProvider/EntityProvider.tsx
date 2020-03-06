import React, {forwardRef} from 'react'
import {EntityProviderProps} from './types'
import {isLocalEntityProviderProps} from './LocalEntityProvider/types'
import LocalEntityProvider from './LocalEntityProvider/LocalEntityProvider'
import {isGraphQLEntityProviderProps} from './GraphQLEntityProvider/types'
import GraphQLEntityProvider from './GraphQLEntityProvider/GraphQLEntityProvider'
import NotImplementedError from '@bast1oncz/objects/dist/error/NotImplementedError'
import {EntityDefinition} from './useEntityDefinitionImperativeHandle'
import {isReadonlyEntityProviderProps} from './ReadonlyEntityProvider/types'
import ReadonlyEntityProvider from './ReadonlyEntityProvider/ReadonlyEntityProvider'

const EntityProvider = forwardRef<EntityDefinition, EntityProviderProps>((props, ref) => {
    if(isReadonlyEntityProviderProps(props)) {
        return (
            <ReadonlyEntityProvider ref={ref} {...props} />
        )
    } else if (isLocalEntityProviderProps(props)) {
        return (
            <LocalEntityProvider ref={ref} {...props} />
        )
    } else if (isGraphQLEntityProviderProps(props)) {
        return (
            <GraphQLEntityProvider ref={ref} {...props} />
        )
    }

    throw new NotImplementedError()
})

export default React.memo(EntityProvider)
