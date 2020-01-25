import EditableEntityContext, {EditableEntityContextValue} from './EditableEntityContext'
import {useContext} from 'react'

export default function useEntityContext(): EditableEntityContextValue<any> {
    const ctx = useContext(EditableEntityContext)
    if(!ctx) {
        throw new Error('Entity context does not wrap this component')
    }

    return ctx
}
