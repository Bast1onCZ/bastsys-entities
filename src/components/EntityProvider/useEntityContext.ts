import EditableEntityContext, {EditableEntityContextValue} from './EditableEntityContext'
import {useContext} from 'react'
import {Entity} from '../../api/types'

export default function useEntityContext<E extends Entity>(): EditableEntityContextValue<E> {
    const ctx = useContext(EditableEntityContext)
    if(!ctx) {
        throw new Error('Entity context does not wrap this component')
    }

    return ctx
}
