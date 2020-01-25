import {Entity, IdentifiableEntity, Mutation} from 'api/types'
import AEntityUpdateRequest from './AEntityUpdateRequest'

export interface EntitiesResponseData<E extends Entity> {
    entities: E[]
}

export default class EntityDeleteRequest<E extends Entity> extends AEntityUpdateRequest<E> {
    performLocalUpdate(entity: E, updateEntity: (newEntity: E|null) => void) {
        updateEntity(null)
    }

    performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation, deleteMutation: Mutation): Promise<EntitiesResponseData<E>> {
        return this.apolloClient.mutate({
            mutation: deleteMutation,
            variables: {
                filter: {
                    id: [entity.id]
                },
                input: {
                    id: true
                }
            }
        })
    }
}
