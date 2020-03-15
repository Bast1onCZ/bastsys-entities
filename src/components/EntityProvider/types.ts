import {Entity} from 'api/types'
import {ReactNode} from 'react'
import {SyncFieldReference} from './useSyncFieldImperativeHandle'
import {FieldReference} from 'logic/fieldReferences'
import {GraphQLEntityProviderProps} from './GraphQLEntityProvider/types'
import {LocalEntityProviderProps} from './LocalEntityProvider/types'
import {ReadonlyEntityProviderProps} from './ReadonlyEntityProvider/types'

export type EntityProviderProps = ReadonlyEntityProviderProps | LocalEntityProviderProps | GraphQLEntityProviderProps

export interface EntityProviderReference {
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
