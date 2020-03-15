
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
