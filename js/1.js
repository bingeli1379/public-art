
//初始化下拉選單選項
function initSelect(){
  const xhr = new XMLHttpRequest()
  xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true)
  xhr.send(null)
  
  xhr.onload = function(){
    const data = JSON.parse(xhr.response).result.records
    
    data.reduce((listSet, item) => listSet.add(item.Zone), new Set())
        .forEach(zone => {
            const option = document.createElement('option')
            option.setAttribute('value',zone)
            option.appendChild(document.createTextNode(zone))
            document.querySelector('#selectZone').appendChild(option)
        })
    //因為鹽埕區不知道為何不在全部地區資料內(全部資料只有一百筆果然不是巧合)，只好手動插入，尷尬
    const salt = document.createElement('option')
    salt.setAttribute('value','鹽埕區')
    salt.textContent = '鹽埕區'
    document.querySelector('#selectZone').appendChild(salt)
  }
}


//取得高雄景點資料與執行回乎函數：渲染清單、查看詳細
function ajax(zone,callback){
  const xhr = new XMLHttpRequest()
  
  if(zone === '全部地區'){
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true)  
  }else{
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&q=' + zone,true)
  }
  xhr.send(null)
  xhr.onload = function(){
    //景點區所有資料的陣列
    const response = JSON.parse(xhr.response).result.records
    
    // console.log(response)
    
    //渲染景點清單或是查看景點詳細資訊
    if(typeof callback === 'function') callback(response)
  }
}


//生成景點清單DOM
function createListDom(data){
  if(!(data instanceof Array)) return
  
  const fragment = document.createDocumentFragment()
  
  data.forEach( (objitem, index) => {
    //最外層list容器
    const list = document.createElement('div')
    list.classList.add('list')
    list.setAttribute('data-index',index + 1)
    //如果資料筆數大於切分頁面就隱藏
    if(index + 1 > dividePage){
      list.style.display = 'none'
    }

    //容器上下區塊
    const top = document.createElement('div')
    const bottom = document.createElement('div')
    top.classList.add('top')
    top.style.backgroundImage = `url(${objitem.Picture1})`
    bottom.classList.add('bottom')

    //上區塊內容
    const name = document.createElement('h4')
    const zone = document.createElement('h6')
    name.classList.add('name')
    zone.classList.add('zone')
    name.appendChild(document.createTextNode(objitem.Name))
    zone.appendChild(document.createTextNode(objitem.Zone))

    //下區塊的內容
    const opentime = document.createElement('p')
    const address = document.createElement('p')
    const telephone = document.createElement('p')
    opentime.classList.add('opentime')
    address.classList.add('address')
    telephone.classList.add('telephone')
    telephone.appendChild(document.createTextNode(objitem.Tel))
    //地址文字長度處理(避免破版)
    if(objitem.Add.length > 18){
      address.appendChild(document.createTextNode(objitem.Add.slice(0,13)))
      address.classList.add('readmore')
      address.setAttribute('data-readmore',objitem.Add)
    }else{
      address.appendChild(document.createTextNode(objitem.Add))
    }
    //開放時間文字長度處理(避免破版)
    if(objitem.Opentime.length > 22){
      opentime.appendChild(document.createTextNode(objitem.Opentime.slice(0,16)))
      opentime.classList.add('readmore')
      opentime.setAttribute('data-readmore',objitem.Opentime)
    }else{
      opentime.appendChild(document.createTextNode(objitem.Opentime))
    }
    
    //免費訊息
    if(objitem.Ticketinfo === '免費參觀'){
      const free = document.createElement('h5')
      free.classList.add('free')
      free.appendChild(document.createTextNode('免費參觀'))
      bottom.appendChild(free)
    }

    //插入節點
    top.appendChild(name)
    top.appendChild(zone)

    bottom.appendChild(opentime)
    bottom.appendChild(address)
    bottom.appendChild(telephone)

    list.appendChild(top)
    list.appendChild(bottom)
    
    fragment.appendChild(list)
  })
  return fragment
}


//渲染景點清單(傳入ajax作為callback)
function renderList(data){
  if(!(data instanceof Array)) return
  
  //插入景點節點
  const listWrapper = document.querySelector('.list-wrapper')
  listWrapper.innerHTML = ''
  listWrapper.appendChild(createListDom(data))
  
  //清除分頁標籤，如果大於一頁資料筆數就生成分頁標籤
  document.querySelector('.page-list').innerHTML = ''
  if(data.length > dividePage){
    renderPageList(data.length)
  } 
}


//查看景點詳細資訊(傳入ajax作為callback，景點名稱name使用bind綁定傳入)
function showTouristAttractionDetail(name,data){
  if(!(data instanceof Array)) return
  
  // console.log('資料結構 ' ,data)
  // console.log('景點名稱 ' ,name)  
  
  const touristAttractionObject = data.find(item => item.Name === name)
  console.log(touristAttractionObject)
  renderTouristAttractionDetail(touristAttractionObject)
}


//渲染景點詳細內容彈出視窗
function renderTouristAttractionDetail(data){
  if(typeof data !== 'object') return
  
  //將body加上overflow: hidden做到防止捲動的效果
  document.body.style.overflow = 'hidden'
  
  //添加背景遮罩
  const mask = document.createElement('div')
  mask.classList.add('mask')
  
  //詳細資訊彈出視窗節點結構
  const detailPart = document.createElement('div')
  detailPart.classList.add('detailPart')
  
  const head = document.createElement('div')
  const body = document.createElement('div')
  head.classList.add('head')
  body.classList.add('body')
  
  //head內節點有 景點名稱 關閉按鈕
  const close = document.createElement('div')
  const name = document.createElement('h5')
  close.classList.add('close')
  //關閉視窗的按鈕事件
  close.addEventListener('click',function(){
    mask.style.animationName = 'maskFadeOut'
    detailPart.style.animationName = 'detailPartScaleOut'
    setTimeout(()=>{
      document.body.removeChild(mask)
      document.body.style.overflow = 'auto'  
    },500)
  })
  name.classList.add('name')
  name.appendChild(document.createTextNode(data.Name))
  
  //body內節點有 大圖片 景點介紹
  const img = document.createElement('div')
  const description = document.createElement('div')
  img.classList.add('img')
  img.style.backgroundImage = `url(${data.Picture1})`
  description.classList.add('description')
  description.appendChild(document.createTextNode(data.Toldescribe))
  
  //組成detailPart彈窗
  head.appendChild(name)
  head.appendChild(close)
  body.appendChild(img)
  body.appendChild(description)
  detailPart.appendChild(head)
  detailPart.appendChild(body)  
  
  //彈窗插入遮罩中再插入body
  mask.appendChild(detailPart)
  document.body.appendChild(mask)  
}


//渲染分頁標籤
function renderPageList(dataLength){
  const fragment = document.createDocumentFragment()
  
  const prev = document.createElement('span')
  prev.classList.add('prev')
  prev.classList.add('disabled')
  prev.setAttribute('data-type','prev')
  prev.appendChild(document.createTextNode('上一頁'))
  fragment.appendChild(prev)
  
  let pageNum = Math.ceil(dataLength / dividePage)
  
  for(let i = 1; i <= pageNum; i++ ){
    const page = document.createElement('span')
    page.classList.add('page')
    if(i === 1){
      page.classList.add('current')
    }
    page.setAttribute('data-type',`${i}`)
    page.appendChild(document.createTextNode(`${i}`))
    fragment.appendChild(page)
  }
  
  const next = document.createElement('span')
  next.classList.add('next')
  next.setAttribute('data-type','next')
  next.appendChild(document.createTextNode('下一頁'))
  fragment.appendChild(next)
  document.querySelector('.page-list').appendChild(fragment)
}

//切換頁面
function switchPage(container,type){
  //首先取得當前頁碼DOM與當前頁碼數字
  const currentPageDom = container.querySelector('.current')
  const currentPageNumber = Number(currentPageDom.getAttribute('data-type'))
  //移除當前頁碼DOM中current這個class
  currentPageDom.classList.remove('current')

  //這邊使用的querySelector包裝
  const selectDom = selector => container.querySelector(`[data-type='${selector}']`)  
  
  let newPageDom = null
  
  if(type === 'prev'){
    newPageDom = selectDom(currentPageNumber - 1)
  }else if(type === 'next'){
    newPageDom = selectDom(currentPageNumber + 1)
  }else{
    newPageDom = selectDom(type)
  }
  
  newPageDom.classList.add('current')
  
  //判斷第一頁或最後一頁給上下一頁加上disabled
  const pageList = container.querySelectorAll(`.page`)  
  //先移除上一頁或下一頁的disabled
  const disabled = container.querySelector('.disabled')
  if(disabled){
    disabled.classList.remove('disabled')
  }
  
  //再判斷是否第一頁或最後頁再加上class
  if(newPageDom === pageList[0]){
    container.querySelector('.prev').classList.add('disabled')
  }else if(newPageDom === pageList[pageList.length - 1]){
    container.querySelector('.next').classList.add('disabled')
  }
  
  //切換單頁清單渲染(因為不是另外做ajax所以這邊使用display:none)
  const newPageNumber = Number(newPageDom.getAttribute('data-type'))
  const rangeMin = (newPageNumber - 1) * dividePage + 1
  const rangeMax = newPageNumber * dividePage
  
  //先將所有清單隱藏
  document.querySelectorAll('.list-wrapper .list').forEach(item => item.style.display = 'none')
  //渲染出符合頁碼的清單
  for(let i = rangeMin; i <= rangeMax; i++){
    const dom = document.querySelector(`.list[data-index='${i}']`)
    if(!dom) break
    dom.style.display = 'inline-block'
  }
  //取得目前document捲動到哪，再加上getBoundingClientRect方法return的物件中top為目前視窗高度到元素上緣相差多少
  const toY = document.documentElement.scrollTop + document.querySelector('.zone-name').getBoundingClientRect().top
  scrollToTop(toY)
}


//頁面捲動
function scrollToTop(y){
  const timer = setInterval(()=>{
    document.documentElement.scrollTop -= document.documentElement.scrollTop / 5
    if(document.documentElement.scrollTop <= y) clearInterval(timer)
  },30)
}



//------------綁定事件---------------

//document生成完成後初始化
document.addEventListener('DOMContentLoaded',function(){
  //熱門行政區點擊事件(按下按鈕為觸發下拉選單change事件)
  document.querySelector('.hot .box').addEventListener('click',function(ev){
    if(ev.target.nodeName !== 'INPUT') return

    const optionList = [...document.querySelectorAll('option')]
    //清空所有selected後再加上符合條件地區的selected
    optionList.forEach(dom => dom.removeAttribute('selected'))
    optionList.find(dom => ev.target.value === dom.value).setAttribute('selected','')
    //觸發事件
    document.querySelector('#selectZone').dispatchEvent(new Event('change'))
    
    // ajax(ev.target.value,renderList)
    // document.querySelector('.zone-name').textContent = ev.target.value
  })

  //初始化下拉選單與綁定事件
  initSelect()
  document.querySelector('#selectZone').addEventListener('change',function(){
    ajax(this.value,renderList)
    console.log(this.value, typeof this.value)
    document.querySelector('.zone-name').textContent = this.value
  })
  
  //預設生成全部地區景點清單
  ajax('全部地區',renderList)
  
  //清單容器綁定查看詳細景點資訊事件
  document.querySelector('.list-wrapper').addEventListener('click',function(ev){
    const targetClassList = [...(ev.target.classList)]
    //判斷只能點到圖片區域
    if(!targetClassList.some(className => className === 'top')) return
    
    const zone = ev.target.querySelector('.zone').textContent
    const name = ev.target.querySelector('.name').textContent
    ajax(zone,showTouristAttractionDetail.bind(null,name))
  })
  
  //go top按鈕綁定事件與監聽捲動事件決定是否顯示該按鈕
  document.querySelector('.go-top').addEventListener('click',function(ev){
    //防止點到查看景點詳細
    ev.stopPropagation()
    
    this.classList.add('hidden')
    
    scrollToTop(0)
  })
  window.addEventListener('scroll',function(){
    let goTop = document.querySelector('.go-top')
    if(document.documentElement.scrollTop > 350){
      goTop.classList.remove('hidden')
    }else{
      goTop.classList.add('hidden')
    }
  })
  
  //切換頁面點擊事件
  document.querySelector('.page-list').addEventListener('click',function(ev){
    if(ev.target.nodeName !== 'SPAN') return

    const type = ev.target.getAttribute('data-type')
    switchPage(this,type)
  })
})

//未來優化
//使用fetch做ajax
//因為沒有深入研究景點api，分頁功能採用display來渲染而不是切換分頁撈相對資料