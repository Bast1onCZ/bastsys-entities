import {Entity, IdentifiableEntity, Mutation} from '../../api/types'
import cloneDeep from 'lodash/cloneDeep'
import AEntityUpdateRequest, {UpdateEntityFunction} from './AEntityUpdateRequest'
import {EntityFieldKeyDefinition} from '../fieldReferences'
import ObjectPathKey, {toKey} from '@bast1oncz/objects/ObjectPathKey'
import {EntityResponseData} from '../../api/generate/generateEntityQuery'
import {ItemSubEntity} from '../../components/syncField/ItemListField/types'

interface IOrderable {
    order: number
}

export default class EntitySetOrderRequest<E extends Entity = Entity> extends AEntityUpdateRequest<E> {
    private readonly prevOrder: number
    private readonly newOrder: number
    private readonly movedItemKey: EntityFieldKeyDefinition

    constructor(movedItemKey: EntityFieldKeyDefinition, prevOrder: number, newOrder: number) {
        super()

        this.movedItemKey = movedItemKey
        this.prevOrder = prevOrder
        this.newOrder = newOrder
    }

    performLocalUpdate(entity: E, updateEntity: UpdateEntityFunction) {
        const itemListFieldKeyPointers = toKey(this.movedItemKey.sourceKey).getPointers()
        itemListFieldKeyPointers.pop()

        const itemListFieldKey = new ObjectPathKey(itemListFieldKeyPointers)

        const newEntity = cloneDeep(entity)
        const itemList: (IOrderable & IdentifiableEntity)[] = itemListFieldKey.getFrom(newEntity)
        itemListFieldKey.setAt(newEntity, this.getExpectedResult(itemList))

        updateEntity(newEntity)
    }

    performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation): Promise<EntityResponseData<E>> {
        return this.apolloClient.mutate({
            mutation: updateMutation,
            variables: {
                filter: {id: entity.id},
                input: ObjectPathKey.join(this.movedItemKey.updateKey || this.movedItemKey.sourceKey, 'order').setAt({}, this.newOrder)
            }
        })
    }

    /**
     * Gets expected result of moving item
     *
     * @param items
     */
    public getExpectedResult(items: ItemSubEntity[]): ItemSubEntity[] {
        items = [...items]
        const currentItem = items[this.prevOrder]
        items.splice(this.prevOrder, 1)
        items.splice(this.newOrder, 0, currentItem)

        return items
    }
}

