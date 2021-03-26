export function terminate(event: Event): void {
  event.preventDefault()
  event.stopPropagation()
}
