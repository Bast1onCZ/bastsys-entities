import {createContext} from 'react'

export type ListTableContentTypeContextValue = 'head' | 'body'

const ListTableContentTypeContext = createContext<ListTableContentTypeContextValue|null>(null)

export default ListTableContentTypeContext
