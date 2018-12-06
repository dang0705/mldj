const _this=this;
const myFunctions = {
  // 所有表格表头的样式重绘
  tableHeadReset: (row, column, rowIndex, columnIndex) => {
    if ( columnIndex === row.length - 1 ) {
      return 'addBtn'
    } else {
      return 'tableHeader'
    }
  },
  disableBackAndForward:()=>{
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL);
    });
  }

};

export default myFunctions
