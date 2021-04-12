import React from 'react'
import { Link } from 'react-router-dom'
import FlexibleInput from './input'
import { inputTypes } from './consts'

/* returns empty span tag if we're at the end of the string */
const Highlight = ({ searchText, rowLen, idx }) => {
  if (rowLen !== idx + 1) {
    return <span className='conv-highlight'>{searchText}</span>
  }
  return <span />
}

const HighlightString = ({ searchText, textToHighlight }) => {
  if (!textToHighlight) return <></>
  const escapedText = searchText.replace(/\[|\]|[\\^$*+?.|()]/g, '\\$&')
  const insensitiveSplit = new RegExp(escapedText, 'i')
  const rowLen = textToHighlight.split(insensitiveSplit).length
  let nonHighlightLength = 0
  return (
    <div>
      {textToHighlight.split(insensitiveSplit).map((nonHighlight, idx) => {
        nonHighlightLength += nonHighlight.length
        const highlightStartIndex =
          nonHighlightLength + idx * escapedText.length
        return (
          <React.Fragment key={idx}>
            <span>{nonHighlight}</span>
            <Highlight
              searchText={textToHighlight.substring(
                highlightStartIndex,
                highlightStartIndex + escapedText.length
              )}
              rowLen={rowLen}
              idx={idx}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export const Search = ({
  queryText,
  entries,
  onTextChange,
  onLinkClick,
  searchDropdown,
  searchOnChange = true,
  onTriggerSearch,
  onBlur
}) => {
  const showResults = queryText && entries.length > 0
  return (
    <div
      className="mr-3 dropdown form-inline conv-search"
      onKeyPress={evt => {
        if (evt.key === 'Enter') {
          onTriggerSearch({ queryText })
        }
      }}
    >
      <FlexibleInput
        type={inputTypes.STRING_TYPE}
        id="searchbox"
        className="form-control border-secondary dropdown-toggle"
        onChange={evt => {
          const triggeredActions = [onTextChange({ queryText: evt })]
          if (searchOnChange === true) {
            triggeredActions.push(onTriggerSearch())
          }
          return triggeredActions
        }}
        value={queryText}
        customInput={{
          type: 'search',
          placeholder: 'Search...',
          'data-toggle': 'dropdown',
          onBlur: () => setTimeout(onBlur, 300)
        }}
      />
      {showResults && searchDropdown && (
        <div
          className={`dropdown-menu dropdown-menu-right conv-search-dropdown ${entries.length > 0 &&
            'show'}`}
        >
          {
          entries.map((entry, index) => (
            <Link
              key={entry.name}
              onClick={() => onLinkClick()}
              className="dropdown-item conv-dropdown-item"
              to={entry.detailURL}
            >
              <HighlightString
                searchText={queryText}
                textToHighlight={entry.name}
              />
              <div className='conv-search-dropdown-model-label'>
                {entry.modelLabel}
              </div>
            </Link>
          ))
          }
        </div>
      )}
    </div>
  )
}
