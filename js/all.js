(function(){
  function createSelect(){
    // 取得遠端資料
    const xhr = new XMLHttpRequest();
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&limit=999', true);
    xhr.send(null);

    xhr.onload = function () {
      // 建立下拉式選單
      let currentPage = 0;
      const datas = JSON.parse(xhr.response).result.records;
      const items_option = document.querySelector('#items_option')
      let areaList = new Set(['所有區域', ...datas.map(item => item.Zone)]);
      areaList.forEach(element => {
        const option = document.createElement('option');
        option.setAttribute('value', element);
        option.appendChild(document.createTextNode(element));
        items_option.appendChild(option);
      });

      // 初始化分頁列表
      function createPagination(){
      // 過濾資料
      const ZoneDatas = [];
      datas.forEach(element => {
        if ( items_option.value === '所有區域' ){
          ZoneDatas.push(element)
        }
        if ( element.Zone === items_option.value ){
          ZoneDatas.push(element)
        }
      });
      // 建立分頁標籤
      const pageNum = Math.ceil(ZoneDatas.length / 10);
      const item_page = document.querySelector('#item_page');
      let str = '';
      for(let i=0; i<pageNum; i++){
        str += `<li class="page-item"><a class="page-link item_pages" href="#">${i+1}</a></li>`;
      }
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
      </li>`
      // 分頁上方標題更新
      document.querySelector('.items_title').textContent = items_option.value;
      // 創建卡片內容
      function createCard(){
        let str = '';
        let free = '';
        let displayQuantity = 10+10*currentPage 
        if ( displayQuantity > ZoneDatas.length ) { displayQuantity = ZoneDatas.length }
        for(let i=10*currentPage; i<displayQuantity; i++){
          if( !ZoneDatas[i].Ticketinfo === '' ) {
            free = 
            `<li class="text-info">
              <i class="fas fa-tag"></i>
              <span>${ZoneDatas[i].Ticketinfo}</span>
            </li>`
          } else {
            free = ''
          }
          str += 
          `<div class="col-sm-6 mb-5">
            <div class="card shadow">
              <div class="card-header d-flex align-items-end justify-content-between bg-item" 
              style="background-image: url(${ZoneDatas[i].Picture1})">
                <h5 class="text-white mb-0 bg-black">${ZoneDatas[i].Name}</h5>
                <h6 class="text-white mb-0 bg-black">${ZoneDatas[i].Zone}</h6>
              </div>
              <div class="card-body">
                <ul class="list-unstyled mb-0">
                  <li>
                    <i class="fas fa-clock"></i>
                    <span>${ZoneDatas[i].Opentime}</span>
                  </li>
                  <li>
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${ZoneDatas[i].Add}</span>
                  </li>
                  <li>
                    <i class="fas fa-phone"></i>
                    <span>${ZoneDatas[i].Tel}</span>
                  </li>
                  ${free}
                  <li>
                    <button type="button" class="btn btn-primary mt-2 card_button">詳細介紹</button>
                    <div class="mt-2 card_describe_hidden">
                      <p class="px-2 py-2 mb-0">${ZoneDatas[i].Toldescribe}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>`
        }
        document.querySelector('#items_content').innerHTML = str
        // 更新分頁active
        document.querySelectorAll('#item_page li').forEach(element => {
          element.classList.remove('active')
        });
        document.querySelectorAll('#item_page li')[currentPage + 1].classList.add('active');
        // 第一頁與最後一頁移除herf
        if ( currentPage == 0 ) {
          setTimeout(function(){
            document.querySelector('.item_pages_pre').setAttribute('href', 'javascript: void(0)')
          }, 10)
        } else {
          document.querySelector('.item_pages_pre').setAttribute('href', '#')
        }
        if ( currentPage === pageNum - 1 ) {
          setTimeout(function(){
            document.querySelector('.item_pages_next').setAttribute('href', 'javascript: void(0)')
          }, 10)
        } else {
          document.querySelector('.item_pages_next').setAttribute('href', '#')
        }
      }
      createCard();
      // 分頁換頁功能
      document.querySelectorAll('.item_pages').forEach(page => {
        page.addEventListener('click', function() {
          currentPage = parseInt(page.textContent) - 1
          createCard();
        })
      });
      // 卡片內容詳細介紹開關
      document.querySelectorAll('.card_button').forEach(element =>
        element.addEventListener('click', function () {
          element.parentNode.childNodes[3].classList.toggle('card_describe_visible');
          element.parentNode.childNodes[3].classList.toggle('card_describe_hidden');
        })
      )
      // 下拉選單監聽功能
      items_option.addEventListener('change', createPagination);
      // 前一頁與後一頁功能監聽
      document.querySelector('.item_pages_pre').addEventListener('click', function () {
        currentPage = parseInt(currentPage) - 1;
        if ( currentPage < 0 ) { currentPage = 0 };
        console.log(currentPage)
        createCard();
      })
      document.querySelector('.item_pages_next').addEventListener('click', function () {
        currentPage = parseInt(currentPage) + 1;
        if ( currentPage > pageNum -1 ) { currentPage = pageNum -1 };
        createCard();
      })
    }
      createPagination();
    }
  }
  createSelect();
}())