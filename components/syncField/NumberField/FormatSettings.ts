interface Currency {
  pattern: string
}

export interface FormatSettings {
  prefix?: string
  suffix?: string
  thousandSeparator?: boolean | string
  decimalSeparator?: boolean | string
  decimalScale?: number
  fixedDecimalScale?: boolean
  allowNegative?: boolean
}

export function getPriceFormat(currency: Currency): FormatSettings {
  const {pattern} = currency
  
  const regResult = pattern.match(/^(.*){value}(.*)$/)
  const prefix = regResult?.[1] as unknown
  const suffix = regResult?.[2] as unknown
  
  if (typeof prefix !== 'string' || typeof suffix !== 'string') {
    throw new Error('Invalid currency format. Format must be like \'prefix{value}suffix\'')
  }
  
  return {
    allowNegative: false,
    thousandSeparator: ' ',
    // decimalSeparator: ',',
    decimalScale: 2,
    fixedDecimalScale: true,
    prefix,
    suffix
  }
}

export const PERCENT_FORMAT: FormatSettings = {
  suffix: ' %'
}
export const WEIGHT_FORMAT: FormatSettings = {
  allowNegative: false,
  // decimalSeparator: ',',
  suffix: ' kg'
}
