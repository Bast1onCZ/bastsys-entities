import cloneDeep from 'lodash/cloneDeep'
import {IdentifiableEntity, Mutation} from '../../api/types'
import {EntityFieldKeyDefinition, FieldReference} from '../fieldReferences'
import AEntityUpdateRequest, {UpdateEntityFunction} from './AEntityUpdateRequest'
import ObjectPathKey, {joinKeys} from '@bast1oncz/objects/ObjectPathKey'
import localEntityToUpdateObject from '../localEntityToUpdateObject'
import {EntityResponseData} from '../../api/generate/generateEntityQuery'
import {v4 as uuid4} from 'uuid'

interface EntityItemListFieldKeyDefinition extends EntityFieldKeyDefinition {
  itemFieldDefinitions: EntityFieldKeyDefinition[]
  itemIdSourceKey: ObjectPathKey
}

export default class EntityAddArrayItemRequest<T extends IdentifiableEntity> extends AEntityUpdateRequest<T> {
  private readonly sourceKey: FieldReference
  private readonly updateKey: FieldReference
  private readonly itemIdSourceKey: ObjectPathKey
  private readonly itemFieldDefinitions: EntityFieldKeyDefinition[]
  private readonly item: object
  
  /**
   *
   * @param def
   * @param item
   */
  constructor(def: EntityItemListFieldKeyDefinition, item: object) {
    super()
    
    this.sourceKey = def.sourceKey
    this.updateKey = def.updateKey || def.sourceKey
    this.itemIdSourceKey = def.itemIdSourceKey
    this.itemFieldDefinitions = def.itemFieldDefinitions
    this.item = item
  }
  
  performLocalUpdate(entity: T, updateEntity: UpdateEntityFunction): void {
    const newEntity = cloneDeep(entity)
    
    const listSourceKey = joinKeys(this.baseSourceKey, this.sourceKey)
    let itemArray: object[] = listSourceKey.getFrom(newEntity)
    if (!itemArray) {
      itemArray = []
      listSourceKey.setAt(newEntity, itemArray)
    }
    itemArray.push(
        this.itemIdSourceKey.setAt(this.item, uuid4())
    )
    
    updateEntity(newEntity)
  }
  
  performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation): Promise<EntityResponseData<T>> {
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
