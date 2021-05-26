import { NullComponent } from './NullComponent'

// override component skipped only if 'null' (undefined by default)
export const skipOverride = (component) => component === null

// Replaces the default component with the desired override, if the override is defined
export const useOverride = (overrideComponent, defaultComponent) => {
  if (skipOverride(overrideComponent)) {
    // If it overrides with null, replace with a blank component
    return NullComponent
  }
  return overrideComponent || defaultComponent
}
