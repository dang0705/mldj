const myFunctions = {
  // 所有表格表头的样式重绘
  tableHeadReset: (row, column, rowIndex, columnIndex) => {
    if ( columnIndex === row.length - 1 ) {
      return 'addBtn'
    } else {
      return 'tableHeader'
    }
  }
};

export default myFunctions
