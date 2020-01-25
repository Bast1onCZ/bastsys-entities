import {Entity, IdentifiableEntity, Mutation} from 'api/types'
import cloneDeep from 'lodash/cloneDeep'
import AEntityUpdateRequest, {UpdateEntityFunction} from './AEntityUpdateRequest'
import {EntityFieldKeyDefinition} from 'logic/fieldReferences'
import ObjectPathKey, {ObjectKeyPointer, toKey} from '@bast1oncz/objects/dist/ObjectPathKey'
import {EntityResponseData} from 'api/generate/generateEntityQuery'

interface IOrderable {
  order: number
}

export default class EntitySetOrderRequest<E extends Entity = Entity> extends AEntityUpdateRequest<E> {
  private prevOrder: number
  private newOrder: number
  private movedItemKey: EntityFieldKeyDefinition
  
  constructor(movedItemKey: EntityFieldKeyDefinition, prevOrder: number, newOrder: number) {
    super()
    
    this.movedItemKey = movedItemKey
    this.prevOrder = prevOrder
    this.newOrder = newOrder
  }
  
  performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation, deleteMutation: Mutation): Promise<EntityResponseData<E>> {
    return this.apolloClient.mutate({
      mutation: updateMutation,
      variables: {
        filter: {id: entity.id},
        input: ObjectPathKey.join(this.movedItemKey.updateKey || this.movedItemKey.sourceKey, 'order').setAt({}, this.newOrder)
      }
    })
  }
  
  performLocalUpdate(entity: E, updateEntity: UpdateEntityFunction) {
    const itemListFieldKeyPointers = toKey(this.movedItemKey.sourceKey).getPointers()
    const currentOrder = +(itemListFieldKeyPointers.pop() as ObjectKeyPointer).key
    const itemListFieldKey = new ObjectPathKey(itemListFieldKeyPointers)
    
    const newEntity = cloneDeep(entity)
    const itemList: (IOrderable & IdentifiableEntity)[] = itemListFieldKey.getFrom(newEntity)
    itemListFieldKey.setAt(newEntity, this.getExpectedResult(itemList))
    
    updateEntity(newEntity)
  }
  
  /**
   * Gets expected result of moving item
   *
   * @param items
   */
  public getExpectedResult(items: IdentifiableEntity[]): IdentifiableEntity[] {
    items = [...items]
    const currentItem = items[this.prevOrder]
    items.splice(this.prevOrder, 1)
    items.splice(this.newOrder, 0, currentItem)
    
    return items
  }
}

