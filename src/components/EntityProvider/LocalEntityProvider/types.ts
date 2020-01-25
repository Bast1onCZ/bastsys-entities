import {LocalUpdateMethodType} from '../UpdateMethodType'
import {BaseEntityProviderProps} from '../types'

export interface LocalEntityProviderProps extends BaseEntityProviderProps {
    type: LocalUpdateMethodType
    /**
     * Updates entity hold in a local state
     *
     * @param Entity
     */
    updateEntity: (Entity) => void
}

export function isLocalEntityProviderProps(value: any): value is LocalEntityProviderProps {
    return value?.type === 'local'
}
