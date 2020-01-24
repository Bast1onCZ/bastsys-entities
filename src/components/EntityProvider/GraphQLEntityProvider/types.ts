import UpdateMethodType from 'components/EntityProvider/UpdateMethodType'
import {IdentifiableEntity, Mutation} from 'api/types'
import {BaseEntityProviderProps} from 'components/EntityProvider/types'

export interface GraphQLEntityProviderProps extends BaseEntityProviderProps {
    type: UpdateMethodType.GRAPHQL_UPDATE
    /**
     * Mutation that updates a value at entity
     */
    updateMutation: Mutation
    /**
     * Mutation that deletes a value at filtered entities (there only one entity is in the filter)
     */
    deleteMutation: Mutation
    entity: IdentifiableEntity
}

export function isGraphQLEntityProviderProps(value: any): value is GraphQLEntityProviderProps {
    return value?.type === UpdateMethodType.GRAPHQL_UPDATE
}
