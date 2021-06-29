import { components } from 'react-select'
import React from 'react'
import * as R from 'ramda'
import { FixedSizeList as List } from 'react-window'

type OptimizedMenuList = {
  options: any
  children: any[]
  maxHeight: number
  getValue: any
}
const OptimizedMenuList = (props: OptimizedMenuList) => {
  const { options, children, maxHeight, getValue } = props
  if (!children || !Array.isArray(children)) return children

  const height = 38
  const listHeight = height * children.length
  const [value] = getValue()
  const initialOffset =
    value && maxHeight < listHeight
      ? options.findIndex((obj: any) => R.equals(obj, value)) * height
      : 0

  return (
    <List
      width="100%"
      height={Math.min(maxHeight, listHeight)}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }: { index: number; style: any }) => (
        <div
          className="select-option-wrapper"
          style={{
            whiteSpace: 'nowrap',
            ...style
          }}
        >
          {children[index]}
        </div>
      )}
    </List>
  )
}

const OptimizedOption = (props: any) => {
  delete props.innerProps.onMouseMove
  delete props.innerProps.onMouseOver
  return <components.Option {...props}>{props.children}</components.Option>
}

export const optimizeSelect = {
  components: {
    MenuList: OptimizedMenuList,
    Option: OptimizedOption
  }
}
