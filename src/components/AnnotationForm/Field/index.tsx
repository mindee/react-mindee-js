import makeStyles from '@material-ui/core/styles/makeStyles'
import classNames from 'classnames'
import ListItem from '@material-ui/core/ListItem'
import { FixedSizeList } from 'react-window'
import React, { SyntheticEvent, useEffect, useRef } from 'react'

import { FieldData, FieldItem, FieldSubItem } from '../../../common/types'
import { COLORS } from '../../../common/constants'

const useStyles = makeStyles({
  root: {},
  subItem: {
    cursor: 'pointer',
    marginRight: 5,
  },
  item: {
    cursor: 'pointer',
    background: COLORS.white,
    borderLeft: '4px solid transparent',
    borderRadius: '4px',
    fontSize: '12px',
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingLeft: 4,
    alignItems: 'center',
  },
  itemWrapper: {
    padding: 0,
    paddingBottom: 4,
  },
  label: {
    cursor: 'pointer',
  },
  title: {},
})

const SubItems = ({
  classes,
  subItems,
  onSubItemLeave,
  onSubItemEnter,
  onSubItemClick,
}) => {
  return subItems.map((subItem: FieldSubItem, key: number) => {
    const {
      label,
      value,
      className,
      onClick = onSubItemClick,
      onMouseEnter = onSubItemEnter,
      onMouseLeave = onSubItemLeave,
    } = subItem
    return (
      <div
        key={key}
        className={classNames(classes.subItem, { [className]: className })}
        onClick={(event: SyntheticEvent) => onClick && onClick(event, subItem)}
        onMouseEnter={(event: SyntheticEvent) =>
          onMouseEnter && onMouseEnter(event, subItem)
        }
        onMouseLeave={(event: SyntheticEvent) =>
          onMouseLeave && onMouseLeave(event, subItem)
        }
      >
        <label className={classes.label}>{label}</label> : <b>{value}</b>
      </div>
    )
  })
}

function renderRow({
  index,
  style,
  items,
  classes,
  onItemMouseEnter,
  onItemMouseLeave,
  onItemClick,
  ...rest
}: any) {
  const item: FieldItem = items[index]
  const {
    subItems,
    className,
    style: customStyle,
    onClick = onItemClick,
    onMouseEnter = onItemMouseEnter,
    onMouseLeave = onItemMouseLeave,
    renderSubItems = (
      subItems: FieldSubItem[],
      onSubItemClick,
      onSubItemEnter,
      onSubItemLeave
    ) => (
      <SubItems
        classes={classes}
        subItems={subItems}
        onSubItemClick={onSubItemClick}
        onSubItemEnter={onSubItemEnter}
        onSubItemLeave={onSubItemLeave}
      />
    ),
  } = item
  return (
    <ListItem
      style={style}
      key={index}
      className={classes.itemWrapper}
      onClick={(event: SyntheticEvent) => onClick && onClick(event, item)}
      onMouseEnter={(event: SyntheticEvent) =>
        onMouseEnter && onMouseEnter(event, item)
      }
      onMouseLeave={(event: SyntheticEvent) =>
        onMouseLeave && onMouseLeave(event, item)
      }
    >
      <div
        style={customStyle}
        className={classNames(classes.item, { [className]: className })}
      >
        {renderSubItems(
          subItems,
          rest?.onSubItemClick,
          rest?.onSubItemEnter,
          rest?.onSubItemLeave
        )}
      </div>
    </ListItem>
  )
}

interface Props {
  field: FieldData
  maxItemsLength?: number
  itemSize?: number
  onFieldClick?: (SyntheticEvent, FieldData) => void
  onFieldMouseEnter?: (SyntheticEvent, FieldData) => void
  onFieldMouseLeave?: (SyntheticEvent, FieldData) => void
  onItemClick?: (SyntheticEvent, FieldItem) => void
  onItemMouseEnter?: (SyntheticEvent, FieldItem) => void
  onItemMouseLeave?: (SyntheticEvent, FieldItem) => void
  onSubItemClick?: (SyntheticEvent, subItem) => void
  onSubItemMouseEnter?: (SyntheticEvent, subItem) => void
  onSubItemMouseLeave?: (SyntheticEvent, subItem) => void
}

const Field = ({
  field,
  onFieldClick,
  onFieldMouseEnter,
  onFieldMouseLeave,
  maxItemsLength = 5,
  itemSize = 50,
  ...rest
}: Props) => {
  const {
    style = {},
    className,
    items,
    label,
    scrollToItem,
    onClick = onFieldClick,
    onMouseEnter = onFieldMouseEnter,
    onMouseLeave = onFieldMouseLeave,
  } = field
  const classes = useStyles()
  const height = Math.min(items.length, maxItemsLength) * itemSize
  const listRef = useRef(null)
  useEffect(() => {
    if (scrollToItem !== undefined) {
      listRef?.current?.scrollToItem(scrollToItem, 'center')
    }
  }, [scrollToItem])
  return (
    <div
      style={style}
      className={classNames(classes.root, { [className]: className })}
    >
      <div className={classes.title}>{label}</div>
      <FixedSizeList
        ref={listRef}
        height={height}
        width={300}
        itemSize={50}
        itemCount={items.length}
        onClick={(event: SyntheticEvent) => onClick && onClick(event, field)}
        onMouseEnter={(event: SyntheticEvent) =>
          onMouseEnter && onMouseEnter(event, field)
        }
        onMouseLeave={(event: SyntheticEvent) =>
          onMouseLeave && onMouseLeave(event, field)
        }
      >
        {(props) => renderRow({ ...props, items, classes, ...rest })}
      </FixedSizeList>
    </div>
  )
}

export default Field
