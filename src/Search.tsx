import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as R from 'ramda'
import FlexibleInput from './input'
import { inputTypes } from './consts'
import { debounce } from 'lodash'

type HighlightProps = {
  searchText: string
  rowLen: number
  idx: number
}
/* returns empty span tag if we're at the end of the string */
const Highlight = ({ searchText, rowLen, idx }: HighlightProps) => {
  if (rowLen !== idx + 1) {
    return <span className="conv-highlight">{searchText}</span>
  }
  return <span />
}

const HighlightString = ({
  searchText,
  textToHighlight
}: {
  searchText: string
  textToHighlight: string
}) => {
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
type SearchPageProps = {
  entries: any
  onLinkClick: CallableFunction
  onFilterClick: CallableFunction
  filters: any
  location: any
}
export const SearchPage = ({
  entries,
  onLinkClick,
  onFilterClick,
  filters,
  location
}: SearchPageProps) => {
  const searchText = location.pathname.split('/')[2]
  const shouldShow = (entry: any) =>
    R.propOr(
      true,
      'checked',
      R.find(R.propEq('modelName', entry.modelName))(filters)
    )
  return (
    <div className="conv-search-page">
      <div className="conv-search-results-desc">
        <p>
          {entries.length} results found for "{searchText}".
        </p>
      </div>
      <div className="conv-search-results">
        <div className="conv-search-filters">
          {R.map(
            (filter) => (
              <FlexibleInput
                key={`FlexibleInput-${filter.modelName}-filter-checkbox`}
                type={inputTypes.BOOLEAN_TYPE}
                id={`${filter.modelName}-filter-checkbox`}
                className="conv-search-filters-checkbox"
                labelStr={`${filter.modelName}s (${filter.count})`}
                value={filter.checked}
                onChange={() => onFilterClick({ modelName: filter.modelName })}
              />
            ),
            filters
          )}
        </div>
        <div className="conv-search-results-items">
          {R.map(
            (entry) =>
              shouldShow(entry) ? (
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
              ) : null,
            entries
          )}
        </div>
      </div>
    </div>
  )
}

type QuickSearchProps = {
  queryText: string
  entries: any[]
  onTextChange: any
  onLinkClick: any
  searchDropdown: boolean
  searchOnChange: boolean
  onTriggerSearch: any
  onBlur: any
}

export const QuickSearch = ({
  queryText,
  entries,
  onTextChange,
  onLinkClick,
  searchDropdown,
  onTriggerSearch,
  onBlur
}: QuickSearchProps) => {
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
        onChange={(evt: any) => {
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
