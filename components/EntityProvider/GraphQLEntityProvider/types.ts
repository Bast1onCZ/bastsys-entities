import UpdateMethodType from '../UpdateMethodType'
import {IdentifiableEntity, Mutation} from '../../../api/types'
import {BaseEntityProviderProps} from '../types'

export interface GraphQLEntityProviderProps extends BaseEntityProviderProps {
    type: UpdateMethodType.GRAPHQL_UPDATE
    /**
     * Mutation that updates a value at entity
     */
    updateMutation: Mutation
    entity: IdentifiableEntity
    readonly?: boolean
}

export function isGraphQLEntityProviderProps(value: any): value is GraphQLEntityProviderProps {
    return value?.type === UpdateMethodType.GRAPHQL_UPDATE
}
