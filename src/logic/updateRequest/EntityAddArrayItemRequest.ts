import cloneDeep from 'lodash/cloneDeep'
import {IdentifiableEntity, Mutation, UnidentifiableEntity} from 'api/types'
import {EntityFieldKeyDefinition, FieldReference} from 'logic/fieldReferences'
import AEntityUpdateRequest, {UpdateEntityFunction} from './AEntityUpdateRequest'
import {joinKeys} from '@bast1oncz/objects/dist/ObjectPathKey'
import localEntityToUpdateObject from 'logic/localEntityToUpdateObject'
import {EntityResponseData} from 'api/generate/generateEntityQuery'

interface EntityItemListFieldKeyDefinition extends EntityFieldKeyDefinition {
  itemFieldDefinitions: EntityFieldKeyDefinition[]
}

export default class EntityAddArrayItemRequest<T extends IdentifiableEntity, I extends UnidentifiableEntity> extends AEntityUpdateRequest<T> {
  private sourceKey: FieldReference
  private updateKey: FieldReference
  private itemFieldDefinitions: EntityFieldKeyDefinition[]
  private item: I
  
  /**
   *
   * @param def
   * @param item
   */
  constructor(def: EntityItemListFieldKeyDefinition, item: I) {
    super()
    
    this.sourceKey = def.sourceKey
    this.updateKey = def.updateKey || def.sourceKey
    this.itemFieldDefinitions = def.itemFieldDefinitions
    this.item = item
  }
  
  performLocalUpdate(entity: T, updateEntity: UpdateEntityFunction): void {
    const newEntity = cloneDeep(entity)
    
    const fullSourceKey = joinKeys(this.baseSourceKey, this.sourceKey)
    let itemArray: I[] = fullSourceKey.getFrom(newEntity)
    if (!itemArray) {
      itemArray = []
      fullSourceKey.setAt(newEntity, itemArray)
    }
    itemArray.push(this.item)
    
    updateEntity(newEntity)
  }
  
  performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation, deleteMutation: Mutation): Promise<EntityResponseData<T>> {
    const itemUpdateInput = localEntityToUpdateObject(this.itemFieldDefinitions, this.item)
    
    return this.apolloClient.mutate({
      mutation: updateMutation,
      variables: {
        filter: {
          id: entity.id
        },
        input: joinKeys(this.baseUpdateKey, this.updateKey).setAt({}, [itemUpdateInput])
      }
    })
  }
}
