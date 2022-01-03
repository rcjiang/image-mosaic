function listToGrid (list, colsCount = 2, gap = 0) {
  const data = [...list]
  const rows = []
  while (data.length) {
    rows.push(data.splice(0, colsCount))
  }

  const cols = Array.from({
    length: Math.min(list.length, colsCount)
  }).map((item, i) =>
    rows.reduce((a, row) => {
      return a.concat(row[i] || [])
    }, [])
  )

  const colsWidth = cols.map(item => getMax(item, 'width'))
  const rowsHeight = rows.map(item => getMax(item, 'height'))

  const cells = list.map((cell, i) => {
    const rowIndex = (i / colsCount) | 0
    const colIndex = i % colsCount
    return {
      cell,
      x: gap * (1 + colIndex) + sum(colsWidth.slice(0, colIndex)),
      y: gap * (1 + rowIndex) + sum(rowsHeight.slice(0, rowIndex)),
      coor: [rowIndex, colIndex]
    }
  })

  return {
    cells,
    width: gap * (1 + colsWidth.length) + sum(colsWidth),
    height: gap * (1 + rowsHeight.length) + sum(rowsHeight)
  }
}

function getMax (list, key) {
  const values = list.map(item => item[key])
  return Math.max.apply(null, values)
}

function sum (...args) {
  return args.flat().reduce((a, b) => a + b, 0)
}

module.exports = {
  listToGrid
}
