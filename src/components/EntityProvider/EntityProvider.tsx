import React, {forwardRef} from 'react'
import {EntityProviderProps} from 'components/EntityProvider/types'
import {isLocalEntityProviderProps} from 'components/EntityProvider/LocalEntityProvider/types'
import LocalEntityProvider from 'components/EntityProvider/LocalEntityProvider/LocalEntityProvider'
import {isGraphQLEntityProviderProps} from 'components/EntityProvider/GraphQLEntityProvider/types'
import GraphQLEntityProvider from 'components/EntityProvider/GraphQLEntityProvider/GraphQLEntityProvider'
import NotImplementedError from '@bast1oncz/objects/dist/error/NotImplementedError'
import {EntityDefinition} from 'components/EntityProvider/useEntityDefinitionImperativeHandle'

const EntityProvider = forwardRef<EntityDefinition, EntityProviderProps>((props, ref) => {
    if (isLocalEntityProviderProps(props)) {
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
