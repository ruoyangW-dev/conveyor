import React from 'react'
import * as R from 'ramda'
import { Tooltip } from 'react-tippy'
import FlexibleInput from './input'
import { inputTypes } from './consts'

const GotoTooltip = ({
  modelName,
  fieldName,
  onChangePage,
  onChangeGoto,
  lastIndex,
  goto,
  canGoto
}) => {
  return (
    <div
      id={`${modelName}${fieldName ? '-' + fieldName : ''}-pg-tooltip`}
      className="goto-tooltip conv-goto-tooltip"
    >
      {canGoto ? null : (
        <div className="mb-2 goto-tooltip-invalid">
          Please enter a valid page number.
        </div>
      )}
      <div className="d-flex">
        <div className="mr-2 float-left">
          <FlexibleInput
            {...{
              type: inputTypes.INT_TYPE,
              id: `${modelName}${fieldName ? '-' + fieldName : ''}-goto`,
              value: goto,
              onChange: (evt) =>
                onChangeGoto({ modelName, fieldName, pageIndex: evt }),
              customInput: {
                placeholder: 'Go to page...'
              }
            }}
          />
        </div>
        <div className="float-right">
          <button
            className="btn btn-success"
            onClick={() =>
              onChangePage({
                modelName,
                fieldName,
                // goto is the page number, which will always be 1 greater than the index
                // because index begins at 0 while page number begins at 1
                updatedPageIndex: goto,
                isValid:
                  1 <= goto && goto <= lastIndex && Number.isInteger(goto)
              })
            }
          >
            Go
          </button>
        </div>
      </div>
    </div>
  )
}

const PaginationLink = ({
  modelName,
  fieldName,
  onChangePage,
  onChangeGoto = null,
  lastIndex,
  goto = null,
  canGoto,
  text,
  updatedPageIndex
}) => {
  const link = (
    <a
      className="page-link"
      onClick={() =>
        onChangePage({
          modelName,
          fieldName,
          updatedPageIndex
        })
      }
    >
      {text}
    </a>
  )
  if (isNaN(text)) {
    return (
      <Tooltip html={<span>{`Page ${updatedPageIndex}`}</span>}>{link}</Tooltip>
    )
  }
  return (
    <Tooltip
      html={
        <GotoTooltip
          {...{
            modelName,
            fieldName,
            onChangePage,
            onChangeGoto,
            lastIndex,
            goto,
            canGoto
          }}
        />
      }
      trigger="click"
      interactive
    >
      {link}
    </Tooltip>
  )
}

export const Pagination = ({
  modelName,
  fieldName = null,
  idx,
  lastIndex,
  goto,
  canGoto,
  onChangePage,
  onChangeGoto,
  totalDataLength,
  amtPerPage
}) => {
  // get previous & last conditions; 'lastIndex' can be null or '0' value
  const hasFirst = idx > 2
  const hasPrev = idx > 1
  const hasNext = lastIndex > 1 && idx < lastIndex
  const hasLast = lastIndex > 1 && idx < lastIndex - 1

  // no pagination
  if (!hasFirst && !hasPrev && !hasNext && !hasLast) {
    return null
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination conv-pagination">
        {hasFirst && (
          <PaginationLink
            {...{
              modelName,
              fieldName,
              onChangePage,
              text: '«',
              updatedPageIndex: 1
            }}
          />
        )}
        {hasPrev && (
          <PaginationLink
            {...{
              modelName,
              fieldName,
              onChangePage,
              text: '‹',
              updatedPageIndex: idx - 1
            }}
          />
        )}
        {
          <PaginationLink
            {...{
              modelName,
              fieldName,
              onChangePage,
              onChangeGoto,
              lastIndex,
              goto,
              canGoto,
              text: `${idx}`,
              updatedPageIndex: idx
            }}
          />
        }
        {hasNext && (
          <PaginationLink
            {...{
              modelName,
              fieldName,
              onChangePage,
              text: '›',
              updatedPageIndex: idx + 1
            }}
          />
        )}
        {hasLast && (
          <PaginationLink
            {...{
              modelName,
              fieldName,
              onChangePage,
              text: '»',
              updatedPageIndex: lastIndex
            }}
          />
        )}
        {totalDataLength && amtPerPage && (
          <span className="ml-2 my-auto">
            {(idx - 1) * amtPerPage + 1}-
            {Math.min(idx * amtPerPage, totalDataLength)} of {totalDataLength}
          </span>
        )}
      </ul>
    </nav>
  )
}

export const IndexPagination = ({ schema, modelName, tableView }) => {
  const actions = schema.getActions(modelName)
  const onChangePage = R.path(['tableOptions', 'changePage'], actions)
  const onChangeGoto = R.path(['tableOptions', 'changeGotoPage'], actions)
  const page = R.path([modelName, 'page'], tableView)
  const goto = R.prop('goto', page)
  const canGoto = R.propOr(true, 'canGoto', page)

  // current page idx
  const idx = R.propOr(1, 'currentPage', page)

  // get index of last hypothetical data point
  const lastIndex = R.prop('lastIndex', page)

  const totalDataLength = R.prop('total', page)
  const amtPerPage = R.prop('amtPerPage', page)

  return (
    <Pagination
      {...{
        modelName,
        idx,
        lastIndex,
        totalDataLength,
        amtPerPage,
        goto,
        canGoto,
        onChangePage,
        onChangeGoto
      }}
    />
  )
}

export const DetailPagination = ({
  schema,
  modelName,
  fieldName,
  tableView
}) => {
  const actions = schema.getActions(modelName)
  const onChangePage = R.path(['tableOptions', 'changeRelTablePage'], actions)
  const onChangeGoto = R.path(['tableOptions', 'changeRelGotoPage'], actions)
  const page = R.path([modelName, 'fields', fieldName, 'page'], tableView)
  const goto = R.prop('goto', page)
  const canGoto = R.propOr(true, 'canGoto', page)

  // current page idx
  const idx = R.propOr(1, 'currentPage', page)

  // get index of last hypothetical data point
  const lastIndex = R.prop('lastIndex', page)

  const totalDataLength = R.prop('total', page)
  const amtPerPage = R.prop('amtPerPage', page)

  return (
    <Pagination
      {...{
        modelName,
        fieldName,
        idx,
        lastIndex,
        totalDataLength,
        amtPerPage,
        goto,
        canGoto,
        onChangePage,
        onChangeGoto
      }}
    />
  )
}
