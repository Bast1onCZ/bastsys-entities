import UpdateMethodType from 'components/EntityProvider/UpdateMethodType'
import {BaseEntityProviderProps} from 'components/EntityProvider/types'

export interface LocalEntityProviderProps extends BaseEntityProviderProps {
    type: UpdateMethodType.LOCAL_UPDATE
    /**
     * Updates entity hold in a local state
     *
     * @param Entity
     */
    updateEntity: (Entity) => void
}

export function isLocalEntityProviderProps(value: any): value is LocalEntityProviderProps {
    return value?.type === UpdateMethodType.LOCAL_UPDATE
}
