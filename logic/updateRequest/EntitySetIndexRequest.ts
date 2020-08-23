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

export default class EntitySetIndexRequest<E extends Entity = Entity> extends AEntityUpdateRequest<E> {
    private readonly prevIndex: number
    private readonly newIndex: number
    private readonly movedItemKey: EntityFieldKeyDefinition

    constructor(movedItemKey: EntityFieldKeyDefinition, prevIndex: number, newIndex: number) {
        super()

        this.movedItemKey = movedItemKey
        this.prevIndex = prevIndex
        this.newIndex = newIndex
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
                input: ObjectPathKey.join(this.movedItemKey.updateKey || this.movedItemKey.sourceKey, 'index').setAt({}, this.newIndex)
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
        const currentItem = items[this.prevIndex]
        items.splice(this.prevIndex, 1)
        items.splice(this.newIndex, 0, currentItem)

        return items
    }
}

