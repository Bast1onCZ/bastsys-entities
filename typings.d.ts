
declare module '*.scss' {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames
    export default classNames
}

declare module '*.png' {
    type SourceUrl = string

    const imageSource: SourceUrl
    export default imageSource
}

declare module '@date-io/type' {
    import Moment from '@date-io/moment'

    export default Moment
}
