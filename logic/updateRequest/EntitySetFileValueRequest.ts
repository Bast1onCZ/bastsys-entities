import {Entity, IdentifiableEntity, Mutation} from '../../api/types'
import {EntityFieldKeyDefinition, FieldReference} from '../fieldReferences'
import AEntityUpdateRequest from './AEntityUpdateRequest'
import {joinKeys} from '@bast1oncz/objects/ObjectPathKey'
import cloneDeep from 'lodash/cloneDeep'
import {EntityResponseData} from '../../api/generate/generateEntityQuery'

export default class EntitySetFileValueRequest<T extends Entity> extends AEntityUpdateRequest<T> {
  private sourceKey: FieldReference
  private updateKey: FieldReference

  private file: File

  constructor(fieldDef: EntityFieldKeyDefinition, file: File) {
    super()

    this.sourceKey = fieldDef.sourceKey
    this.updateKey = fieldDef.updateKey || fieldDef.sourceKey

    this.file = file
  }

  /**
   * Reads a file as a binary string, that can be accessed through a promise
   *
   * @returns {Promise<string>}
   */
  private readFileAsBinaryString() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        resolve(e.target.result)
      }
      reader.onerror = () => {
        console.error('An error occured while reading file ', this.file, ': ', reader.error)
        reject(reader.error)
      }
      reader.readAsBinaryString(this.file)
    })
  }

  /**
   * @param entity
   * @param updateEntity
   * @returns {Promise<string>} promise containing binary file string
   */
  performLocalUpdate(entity: T, updateEntity: (newEntity: any) => void): Promise<object> | void {
    const binaryStringPromise = this.readFileAsBinaryString()
    binaryStringPromise.then((binaryFileString: any) => {
      const {name, type: mimeType} = this.file
      const base64Image = btoa(binaryFileString)
      const newEntity = joinKeys(this.baseSourceKey, this.sourceKey)
          .setAt(
              cloneDeep(entity), {
                name,
                mimeType,
                content: base64Image
              })

      updateEntity(newEntity)
    })

    return binaryStringPromise as Promise<object>
  }

  /**
   * @param entity
   * @param updateMutation
   * @returns {Promise<Object>} promise containing apollo response
   */
  public performGraphqlUpdate(entity: IdentifiableEntity, updateMutation: Mutation): Promise<EntityResponseData<T>> {
    return new Promise((resolve, reject) => {
      const binaryStringPromise = this.readFileAsBinaryString()

      binaryStringPromise.then((binaryFileString: any) => {
        this.apolloClient.mutate({
          mutation: updateMutation,
          variables: {
            filter: {id: entity.id},
            input: joinKeys(this.baseUpdateKey, this.updateKey)
              .setAt({}, {
                name: this.file.name,
                mimeType: this.file.type,
                content: btoa(binaryFileString)
              })
          }
        }).then(response => resolve(response))
          .catch(err => reject(err))
      }).catch(err => reject(err))
    })
  }
}
