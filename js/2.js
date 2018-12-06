const xhr = new XMLHttpRequest();
xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&limit=999',false);
xhr.send(null);
let items = JSON.parse(xhr.responseText).result.records;
const items_content = document.querySelector('#items_content');
const items_option = document.querySelector('#items_option');
let datas_card_list = '';
let datas_option_list = '';
let datas = ''
function create_card_list () {
  items.forEach(data => {
    let card_html = `
      <div class="col-sm-6 mb-5">
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
              <li>
                <i class="fas fa-tag"></i>
                <span>${data.Ticketinfo}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>`;
      datas_card_list += card_html;
  });
  items_content.innerHTML = datas_card_list;
}

function create_option_list () {
  let item_type = ['全部行政區'];
  items.forEach(item => {
    if(item_type.indexOf(item.Zone) < 0){
      item_type.push(item.Zone);
    }
  });
  item_type.forEach(item => {
    let option_html =`
      <option value="${item}">${item}</option>
      `;
      datas_option_list += option_html;
  });
  items_option.innerHTML = datas_option_list;
}

create_card_list ();
create_option_list ();



items_option.addEventListener('change', change_area(), false)

function change_area () {
  // items.filter(() => {
    let aa = document.querySelector('#items_option').value;
    console.log(aa)
  // })
}

