(function () {

  // 新增下拉式選單
  function createSelect () {
    const xhr = new XMLHttpRequest();
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&limit=999', true);
    xhr.send(null);

    xhr.onload = function () {
      const data = JSON.parse(xhr.response).result.records;
      let areaName = data.map(item => item.Zone);
      let areaList = new Set(['所有地區', ...areaName]);
      areaList.forEach(element => {
        const option = document.createElement('option');
        option.setAttribute('value', element);
        option.appendChild(document.createTextNode(element));
        document.querySelector('#items_option').appendChild(option);
      });
    };
  };
  createSelect();

  //取得各區資料
  function createCard () {
    const xhr = new XMLHttpRequest();
    let SelectName = document.querySelector('#items_option').value;
    if( SelectName == '所有區域') {
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&limit=999', true);
    } else {
      xhr.open('get',`https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&q=${SelectName}`, true);
    }
    xhr.send(null);

    xhr.onload = function () {
      // const data = JSON.parse(xhr.response).result.records;
      // console.log()
    };
  }
    document.querySelector('#items_option').addEventListener('change', createCard, false)
}());