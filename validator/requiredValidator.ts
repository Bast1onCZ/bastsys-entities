export default function requiredValidator(value) {
  if (value === null || value === undefined || value === '') {
    return 'This field is required'
  }
}
