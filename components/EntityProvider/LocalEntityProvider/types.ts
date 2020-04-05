import UpdateMethodType from '../UpdateMethodType'
import {BaseEntityProviderProps} from '../types'

export interface LocalEntityProviderProps extends BaseEntityProviderProps {
    type: UpdateMethodType.LOCAL_UPDATE
    /**
     * Updates entity hold in a local state
     *
     * @param Entity
     */
    updateEntity: (Entity) => void
    disabled?: boolean
}

export function isLocalEntityProviderProps(value: any): value is LocalEntityProviderProps {
    return value?.type === UpdateMethodType.LOCAL_UPDATE
}
