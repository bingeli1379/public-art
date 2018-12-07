(function () {

  const items_option = document.querySelector('#items_option')
  // 初始化下拉式選單
  function createSelect () {
    const xhr = new XMLHttpRequest();
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&limit=999', true);
    xhr.send(null);

    xhr.onload = function () {
      const datas = JSON.parse(xhr.response).result.records;
      let areaName = datas.map(item => item.Zone);
      let areaList = new Set(['所有區域', ...areaName]);
      areaList.forEach(element => {
        const option = document.createElement('option');
        option.setAttribute('value', element);
        option.appendChild(document.createTextNode(element));
        items_option.appendChild(option);
      });
    };
  };

  // 初始化分頁列表
  function createPagination () {
    const xhr = new XMLHttpRequest();
    let SelectName = items_option.value;
    if( !SelectName ) {
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&limit=999', true);
    } else {
      xhr.open('get',`https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&q=${SelectName}`, true);
    }
    xhr.send(null);

    xhr.onload = function () {
      let datas = JSON.parse(xhr.responseText).result.records;
      let pageNum = Math.ceil(datas.length / 10);
      const item_page = document.querySelector('#item_page');
      let str = '';
      for(i=0; i<pageNum; i++){
        str += `<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`;
      }
      if ( pageNum == 1 ){
        item_page.innerHTML = str;
      } else {
      item_page.innerHTML = 
      `<li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>` + str +
        `<li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>`;
      }
      createCard (datas)
    };
  }

  // 初始化內容卡片
  function createCard (datas) {
    console.log(datas)
    let str = '';
    datas.forEach(data => {
      str += `<div class="col-sm-6 mb-5">
        <div class="card shadow">
          <div class="card-header d-flex align-items-end justify-content-between bg-item" 
          style="background-image: url(${data.Picture1})">
            <h5 class="text-white mb-0">${data.Name}</h5>
            <h6 class="text-white mb-0">${data.Zone}</h6>
          </div>
          <div class="card-body">
            <ul class="list-unstyled mb-0">
              <li>
                <i class="fas fa-clock"></i>
                <span>${data.Opentime}</span>
              </li>
              <li>
                <i class="fas fa-map-marker-alt"></i>
                <span>${data.Add}</span>
              </li>
              <li>
                <i class="fas fa-phone"></i>
                <span>${data.Tel}</span>
              </li>
              <li class="text-info">
                <i class="fas fa-tag"></i>
                <span>${data.Ticketinfo}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>`;
    });
    items_content.innerHTML = str
  }





  items_option.addEventListener('change', createPagination, false)

  createSelect();
  createPagination ();
}());