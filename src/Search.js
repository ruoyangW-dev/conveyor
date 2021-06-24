import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import FlexibleInput from './input'
import { inputTypes } from './consts'
import { debounce } from 'lodash'

/* returns empty span tag if we're at the end of the string */
const Highlight = ({ searchText, rowLen, idx }) => {
  if (rowLen !== idx + 1) {
    return <span className="conv-highlight">{searchText}</span>
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

export const SearchPage = ({
  entries,
  onLinkClick,
  onFilterClick,
  location
}) => {
  const searchText = location.pathname.split('/')[2]
  const flag = {}
  const uniqueModels = []
  entries.map((entry) => {
    if (!flag[entry.modelName]) {
      flag[entry.modelName] = true
      uniqueModels.push(entry.modelName)
    }
  })
  return (
    <div>
      <p style={{ textAlign: 'center' }}>
        {entries.length} results found for "{searchText}".
      </p>
      {entries
        .filter((entry) => entry.show)
        .map((entry) => (
          <Link
            key={entry.name}
            onClick={() => onLinkClick()}
            className="conv-dropdown-item"
            to={entry.detailURL}
          >
            <HighlightString
              searchText={searchText}
              textToHighlight={entry.name}
            />
            <div className="conv-search-dropdown-model-label">
              {entry.modelLabel}
            </div>
          </Link>
        ))}
      {uniqueModels.map((modelName) => {
        return (
          <FlexibleInput
            key={`FlexibleInput-${modelName}-filter-checkbox`}
            type={inputTypes.BOOLEAN_TYPE}
            id={`${modelName}-filter-checkbox`}
            labelStr={modelName}
            value={true}
            onChange={() => onFilterClick({ modelName })}
          />
        )
      })}
    </div>
  )
}

export const QuickSearch = ({
  queryText,
  entries,
  onTextChange,
  onLinkClick,
  searchDropdown,
  onTriggerSearch,
  onBlur
}) => {
  const showResults = queryText && entries.length > 0
  const history = useHistory()
  const debouncedOnTriggerSearch = useCallback(
    debounce((queryText) => onTriggerSearch({ queryText }), 500),
    []
  )
  return (
    <div
      className="conv-search"
      onKeyPress={(evt) => {
        if (evt.key === 'Enter') {
          history.push(`/Search/${queryText}`)
          onTriggerSearch({ queryText, isOnSearchPage: true })
          onBlur()
        }
      }}
      onFocus={() => {
        if (queryText !== '') {
          onTriggerSearch({ queryText })
        }
      }}
    >
      <FlexibleInput
        type={inputTypes.STRING_TYPE}
        id="searchbox"
        className="conv-search-box"
        onChange={(evt) => {
          onTextChange({ queryText: evt })
          debouncedOnTriggerSearch(evt)
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
        <div className={`conv-search-dropdown ${entries.length > 0 && 'show'}`}>
          {entries.map((entry) => (
            <Link
              key={entry.name}
              onClick={() => onLinkClick()}
              className="conv-dropdown-item"
              to={entry.detailURL}
            >
              <HighlightString
                searchText={queryText}
                textToHighlight={entry.name}
              />
              <div className="conv-search-dropdown-model-label">
                {entry.modelLabel}
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link
        to={`/Search/${queryText}`}
        onClick={() => {
          onTriggerSearch({ queryText, isOnSearchPage: true })
          onBlur()
        }}
        className="nav-link"
      >
        Search
      </Link>
    </div>
  )
}
