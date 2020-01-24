import {Entity} from 'api/types'
import {ReactNode} from 'react'
import {SyncFieldReference} from 'components/EntityProvider/useSyncFieldImperativeHandle'
import {FieldReference} from 'logic/fieldReferences'
import {GraphQLEntityProviderProps} from 'components/EntityProvider/GraphQLEntityProvider/types'
import {LocalEntityProviderProps} from 'components/EntityProvider/LocalEntityProvider/types'

export type EntityProviderProps = LocalEntityProviderProps | GraphQLEntityProviderProps

export interface EditableEntityProviderReference {
  isPrepared: boolean
  fieldRefs: SyncFieldReference[]
  hasError: boolean
}

export interface BaseEntityProviderProps {
  entity: Entity
  children: ReactNode
  /**
   * If defined, sub entity is exposed in the consumer
   */
  sourceKey?: FieldReference
  updateKey?: FieldReference
  deleteKey?: FieldReference
}
