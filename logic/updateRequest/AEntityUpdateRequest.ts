import {Entity, IdentifiableEntity, Mutation, UnidentifiableEntity} from '../../api/types'
import {FieldReference} from '../fieldReferences'
import {ApolloClient} from '@apollo/client'
import {EntityResponseData} from '../../api/generate/generateEntityQuery'
import {EntitiesResponseData} from './EntityDeleteRequest'

export type UpdateEntityFunction = (newEntity: any) => void

abstract class AEntityUpdateRequest<T extends Entity> {
  protected baseSourceKey: FieldReference = ''
  protected baseUpdateKey: FieldReference = ''
  protected baseDeleteKey: FieldReference = ''
  protected apolloClient: ApolloClient<any>|any = undefined
  
  public setBaseKeys(baseSourceKey: FieldReference, baseUpdateKey: FieldReference = '', baseDeleteKey: FieldReference = '') {
    this.baseSourceKey = baseSourceKey
    this.baseUpdateKey = baseUpdateKey || baseSourceKey
    this.baseDeleteKey = baseDeleteKey || baseUpdateKey || baseSourceKey
  }

  public setApolloClient(apolloClient: ApolloClient<any>) {
    this.apolloClient = apolloClient
  }
  
  /**
   * Performs local update
   *
   * @param entity
   * @param updateEntity
   */
  public abstract performLocalUpdate(entity: UnidentifiableEntity, updateEntity: UpdateEntityFunction): Promise<object>|void;
  
  /**
   * Performs graphql update
   *
   * @param entity
   * @param updateMutation
   */
  public abstract performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation): Promise<EntityResponseData<T>|EntitiesResponseData<T>>;
}

export default AEntityUpdateRequest
