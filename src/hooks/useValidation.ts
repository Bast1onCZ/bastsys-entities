import {useMemo} from 'react'
import {isEntityReference, ReferableValue} from '../components/syncField/EntityReference'
import {Entity} from '../api/types'

/**
 * A validator function is receives a value and returns an error as a string or undefined when there is no error
 *
 * value is undefined when not contained at entity
 * value is null when set to null
 */
export interface ValidatorFunction {
    (value: unknown): string | undefined
}

export interface ValidationResult {
    hasError: boolean
    error: string | undefined
}

export interface ErrorReferences {
    [index: number]: ValidationResult
}

/**
 *
 * @param {any} value
 * @param {function(value)|null} validate - function must return a string for an error or (null || undefined) for a value that is ok; if validation function not given, value is considered always valid
 *
 * @return {{hasError: boolean, error: (string|undefined)}}
 */
export default function useValidation(value: unknown, validate?: ValidatorFunction): ValidationResult {
    const error = (validate && validate(value)) || undefined
    const hasError = !!error

    return useMemo<ValidationResult>(() => ({
        error,
        hasError
    }), [error])
}

/**
 *
 * @param entity
 * @param value
 * @param validate
 */
export function useDynamicValidation<E = Entity>(entity: E, value: any, validate?: ReferableValue<ValidatorFunction>) {
    const validator: ValidatorFunction | undefined = isEntityReference(validate)
        ? validate.getValue(entity)
        : validate

    return useValidation(value, validator)
}
