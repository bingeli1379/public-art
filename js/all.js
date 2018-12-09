(function () {

  const items_option = document.querySelector('#items_option')
  let x = 1
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
    if( !SelectName || SelectName == '所有區域' ) {
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
      if ( !SelectName ) {} else {
        document.querySelector('.items_title').textContent = SelectName;
      }
      for(i=0; i<pageNum; i++){
        str += `<li class="page-item"><a class="page-link item_pages" href="#">${i+1}</a></li>`;
      }
      if ( pageNum == 1 ){
        item_page.innerHTML = str;
      } else {
      item_page.innerHTML = 
      `<li class="page-item">
        <a class="page-link item_pages_pre" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>` + str +
      `<li class="page-item">
        <a class="page-link item_pages_next" href="#" aria-label="Next">
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
    let str = '';
    let pageNum = Math.ceil(datas.length / 10);
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
    document.querySelector('#items_content').innerHTML = str
    changepage(datas, 1);

    // 換頁功能
    let pages = document.querySelectorAll('.item_pages');
    pages.forEach(page => {
      page.addEventListener('click', function() {
      x = page.textContent
        changepage( datas, x)
      })
    });

    document.querySelector('.item_pages_pre').addEventListener('click', function () {
      x = parseInt(x) - 1
      if ( x < 1) { x = 1};
      changepage( datas, x)
    })
    document.querySelector('.item_pages_next').addEventListener('click', function () {
      x = parseInt(x) + 1
      if ( x > pageNum) {x = pageNum}
      changepage( datas, x)
    })
  }

  // 分頁active與卡片顯示
  function changepage ( datas, x) {
    let cuttentpage = x
    let endpage = 10 + (cuttentpage-1)*10 ;
    if ( endpage > datas.length){endpage = datas.length};

    document.querySelectorAll('#items_content > div').forEach( function (item) {
      item.style.display = 'none';
      item.style.opacity = 0
    })
    for (let i = (cuttentpage-1)*10; i < endpage; i++) {
      document.querySelectorAll('#items_content > div')[i].style.display = 'block';
      setTimeout(() => {
        document.querySelectorAll('#items_content > div')[i].style.opacity = 1;
      }, 10);
    }
    document.querySelectorAll('#item_page li').forEach(element => {
      element.classList.remove('active')
    });
    document.querySelectorAll('#item_page li')[x].classList.add('active')
  }

  // 執行
  createSelect ();
  createPagination ();
  items_option.addEventListener('change', createPagination, false)

  
}());