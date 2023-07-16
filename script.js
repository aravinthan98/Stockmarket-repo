let cards=document.querySelector('.cards');
let card_container=document.querySelector('.card-container');
let input=document.getElementById('search');
let sbtn=document.querySelector('.submit');
let removesearch=document.querySelector(".result button");
let watchcontainer=document.querySelector('.watchlistgroups')
let result=document.getElementById('hline');
let newscontainer=document.querySelector('.news-feed');
let datetime=document.getElementById('datetime')

let apiArray = ["865DLLK5P0MD6MVP", "UZUT9SLX3B80XXCL", "EKY7LIH1LT1WB1BO",
 "5AFK0YIWM9AL9JQF", "P44XVYYIWNQYMIQW", "FJFVCT5Z9CC9HL4I","YT4X7CD6KBOLTHKH","J4YZY2TSAID1TRKQ","QVO7CI89VPLA9EDU","A0N8JXE0OPCIT1CD","FUCFOI6FMDWEIX39"];

let keyForApi = "865DLLK5P0MD6MVP";

let apiIndex = 0;
let watchlist=[];
let modetype='INTRADAY';
function keyForApiFn() { 
    keyForApi = apiArray[apiIndex];
    apiIndex++;
  
  if (apiIndex == apiArray.length - 1) {
    apiIndex = 0;
  }
}


async function geturl(urlkey,work){
    keyForApiFn()
    console.log(keyForApi,'line32');
    try{
    let url=await fetch(urlkey);
    let response=await url.json();
    
    // console.log(response,'line36');

    if(work==="search"){
        if(response.bestMatches.length>0){
            let data=await response.bestMatches;
            showSearchresult(data);    
        }
        else{
            cards.innerHTML=`<h2>No such result found</h2>`
         
        }   
        
    }
    else{
       if(modetype==='INTRADAY'){
            if(response.hasOwnProperty('Time Series (5min)')) {
                const timeSeries = response['Time Series (5min)'];
                const latestEntry = Object.keys(timeSeries)[1];
                const latestPrice = timeSeries[latestEntry]['4. close'];
                // console.log(latestPrice);
            watchlist[2]=latestPrice;

            result.innerHTML=`${watchlist[0]} Intraday Detailts`
            let data=await response["Time Series (5min)"];      
            showInformation(data,modetype);
            }
            else{
                result.innerHTML=`No Detailts for ${watchlist[0]} INTRADAY now`
            }

        }
        else if(modetype==='DAILY_ADJUSTED'){
            if(response.hasOwnProperty('Time Series (Daily)')) {
                const timeSeries = response['Time Series (Daily)'];
                const latestEntry = Object.keys(timeSeries)[1];
                const latestPrice = timeSeries[latestEntry]['4. close'];
                // console.log(latestPrice)
                watchlist[2]=latestPrice;
            
            result.innerHTML=`${watchlist[0]} Daily Detailts`
            let data=await response["Time Series (Daily)"];      
            showInformation(data,modetype);
            }
            else{
                result.innerHTML=`No Detailts for ${watchlist[0]} DAILY now`
            }

        }
        else if(modetype==='WEEKLY'){
            // console.log(response)
            if(response.hasOwnProperty('Weekly Time Series')) {
                const timeSeries = response['Weekly Time Series'];
                const latestEntry = Object.keys(timeSeries)[1];
                const latestPrice = timeSeries[latestEntry]['4. close'];
                // console.log(latestPrice)
                watchlist[2]=latestPrice;

            result.innerHTML=`${watchlist[0]} Weekly Detailts`
            let data=await response["Weekly Time Series"];      
            showInformation(data,modetype);
            }
            else{
                result.innerHTML=`No Detailts for ${watchlist[0]} WEEKLY now`
            }

        }
        else if(modetype==='MONTHLY'){
            // console.log(response)
            if(response.hasOwnProperty('Monthly Time Series')) {
                const timeSeries = response['Monthly Time Series'];
                const latestEntry = Object.keys(timeSeries)[1];
                const latestPrice = timeSeries[latestEntry]['4. close'];
                console.log(latestPrice)
                watchlist[2]=latestPrice;
            
            result.innerHTML=`${watchlist[0]} Monthly Detailts`
            let data=await response["Monthly Time Series"];      
            showInformation(data,modetype);
            }
            else{
                result.innerHTML=`No Detailts for ${watchlist[0]} MONTHLY now`
            }

        }
        
        
    }

    }
    catch (error) {
        console.log('Error:', error);
    }
    
}


function gettime(){

    let date=new Date()
   let getdate=""+date;
  let val= getdate.substring(0,15);
  datetime.innerHTML=val;
}
gettime()



function removefromlist(e){
    
    // e.parentElement.parentElement.remove();
    let id=e.id;
    let watchlistarr=JSON.parse(localStorage.getItem('products'))
    watchlistarr.forEach((element,index)=>{
        if(element[0]===id){
            watchlistarr.splice(index,1);
        }
    })
    localStorage.setItem('products',JSON.stringify(watchlistarr));
    addTowatchlist();
}

function addTowatchlist(){
    
    let list=JSON.parse(localStorage.getItem('products'));
    // console.log(list)
    watchcontainer.innerHTML='';
    list.forEach(element => {
        watchcontainer.innerHTML+=
        ` <div class="wgroup">
        <h1 id="syml">${element[0]}</h1><h4>${element[1]}</h4>
        <h2>${element[2]}</h2>
        <button id="view" onclick="viewcard(this)">VIEW</button>
        <button class="delete" id=${element[0]} onclick="removefromlist(this)"><i class="fa-solid fa-circle-xmark"></i></button>
        </div>`;
    });       
}
if (localStorage.length > 0) {
    addTowatchlist();
}
function addtolocalstorage(){
    let listproducts;
    if(localStorage.getItem("products")){
        listproducts=JSON.parse(localStorage.getItem("products"))
    }
    else{
        listproducts=[]
    }
    if(watchlist.length>2){
    listproducts.push(watchlist);
    }
    localStorage.setItem('products',JSON.stringify(listproducts));

    addTowatchlist();   
}
function checkduplicates(){
    let listproducts;
    let isduplicate=false;
    if(localStorage.getItem("products")){
        listproducts=JSON.parse(localStorage.getItem("products")); 
            listproducts.forEach(item=>{
                if(item.includes(watchlist[0])){
                    isduplicate=true;
                }
            })
    }
   if(!isduplicate){
        addtolocalstorage()
   }
    // console.log(listproducts,"listproduct");
   
}

function showInformation(data){
    // document.querySelector('body').style.backdropFilter='blur(10px)';
    cards.innerHTML =`<div id="modebtn">
    <button id="INTRADAY" onclick='viewmodedetails("INTRADAY")'>Intraday</button>
    <button id="DAILY_ADJUSTED" onclick='viewmodedetails("DAILY_ADJUSTED")'>Daily</button>
    <button id="WEEKLY" onclick='viewmodedetails("WEEKLY")'>Weekly</button>
    <button id="MONTHLY" onclick='viewmodedetails("MONTHLY")'>Monthly</button>
    </div>
    <table style="width:100%">
    <tr>
        <th>DATE</th>
        <th>OPEN</th>
        <th>HIGH</th>
        <th>LOW</th>
        <th>CLOSE</th>
        <th>VOLUME</th>
    </tr>
    </table>`;

 let count=0;
    // console.log(count);
    document.getElementById(modetype).style.backgroundColor='#d71035'
    for(let item in data){
        
        if(data.hasOwnProperty(item)){
        let info=data[item]
            // console.log(info);
        if(modetype==='DAILY_ADJUSTED'){
            let detail= `<tr>
                    <td>${item}</td>
                    <td>${info["1. open"]}</td>
                    <td>${info["2. high"]}</td>
                    <td>${info["3. low"]}</td>
                    <td>${info["4. close"]}</td>
                    <td>${info["6. volume"]}</td>
                </tr>`
                
            document.querySelector('table').innerHTML+=detail;
        }
        else{
            if(modetype==='INTRADAY'){
                let detail= `<tr>
                        <td>${item.substring(item.length-8)}</td>
                        <td>${info["1. open"]}</td>
                        <td>${info["2. high"]}</td>
                        <td>${info["3. low"]}</td>
                        <td>${info["4. close"]}</td>
                        <td>${info["5. volume"]}</td>
                    </tr>`
                    
                document.querySelector('table').innerHTML+=detail;
            }
            else{
            let detail= `<tr>
                         <td>${item}</td>
                         <td>${info["1. open"]}</td>
                         <td>${info["2. high"]}</td>
                         <td>${info["3. low"]}</td>
                         <td>${info["4. close"]}</td>
                         <td>${info["5. volume"]}</td>
                        </tr>`
                 document.querySelector('table').innerHTML+=detail;
            }        
        }
        }
                count++;
                if(count>4){
                    break;
                }
            
        
        
    }
    // console.log(watchlist,"watch");
    cards.innerHTML+=`<button class="addtowatchlist">ADD TO WATCHLIST</button>`
   
    
    
    let addtowatch=document.querySelector('.addtowatchlist')

    addtowatch.onclick=()=>{
          
        checkduplicates();
    }



}
function showSearchresult(data){
    cards.innerHTML="";
    for(let item of data){
         
        cards.innerHTML+=`<div class="search-symbol" onclick="viewdetails(this)">
        <h3>${item["1. symbol"]}</h3>
        <h5>${item["2. name"]}</h5>
        </div>`
             
        
    };
}


sbtn.onclick=(e)=>{
    
    cards.innerHTML="";
    result.innerHTML='Search Results'
    card_container.style.display="block";
    let urlkey=`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input.value}&apikey=${keyForApi}`
    input.value='';
    document.querySelector(".left").style.display="none";
    // console.log(urlkey,"uralk")
    geturl(urlkey,"search");
    
    
}

removesearch.onclick=(e)=>{
    modetype='INTRADAY'
    cards.innerHTML="";
    result.innerHTML='';
    card_container.style.display="none";
    document.querySelector(".left").style.display="block";
}

function viewmodedetails(value){
  
   
    
    let urlkey=`https://www.alphavantage.co/query?function=TIME_SERIES_${value}&symbol=${watchlist[0]}&interval=5min&apikey=${keyForApi}`;
    modetype=value;
    geturl(urlkey,"showdetails");
    
}
function viewcard(e){
    
    card_container.style.display="block";
    
    // console.log(e.parentElement.firstChild.nextSibling.innerHTML,"viewcard")
    // console.log(e.parentElement.firstChild.nextSibling.nextSibling.innerHTML,"viewcard")
 
    watchlist[0]=e.parentElement.firstChild.nextSibling.innerHTML;
    watchlist[1]=e.parentElement.firstChild.nextSibling.nextSibling.innerHTML;
    let urlkey=`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${watchlist[0]}&interval=5min&apikey=${keyForApi}`;
    document.querySelector(".left").style.display="none";
  
    geturl(urlkey,"showdetails");
}

function viewdetails(e){

   watchlist[0]=e.firstChild.nextSibling.innerHTML;
   watchlist[1]=e.lastChild.previousSibling.innerHTML;

    let urlkey=`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${watchlist[0]}&interval=5min&apikey=${keyForApi}`;
    // console.log(urlkey,"urlkey")
    geturl(urlkey,"showdetails");
    
}
//---------------------------------------Trending groups-------------------------------------------------
async function trendinggroup(){
  
    let urlkey='https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=QA01E5JHRX1AZD92';
    try{
    let url=await fetch(urlkey);
    let response=await url.json();
    
    if(response.hasOwnProperty('most_actively_traded')){
        let data=await response.most_actively_traded; 
        console.log(data,"data");
        showtrendinggroup(data); 
    }
    
    
    }
    catch (error) {
        console.log('Error:', error);
    }
}

function showtrendinggroup(data){
    
    data.sort((a,b)=>{
        b=parseInt(b.change_amount)
        a=parseInt(a.change_amount)
        
        return  b - a;
    })
    
    // console.log(data[1].ticker,"ticker")
    document.getElementById('grp1').innerHTML=`<h1>${data[0].ticker}</h1><h2>$ ${data[0].price}</h2><h3><i class="fa-solid fa-arrow-trend-up"></i> ${data[0].change_percentage}</h3>`
    document.getElementById('grp2').innerHTML=`<h1>${data[1].ticker}</h1><h2>$ ${data[1].price}</h2><h3><i class="fa-solid fa-arrow-trend-up"></i> ${data[1].change_percentage}</h3>`
    document.getElementById('grp3').innerHTML=`<h1>${data[2].ticker}</h1><h2>$ ${data[2].price}</h2><h3><i class="fa-solid fa-arrow-trend-up"></i> ${data[2].change_percentage}</h3>`

        

}
trendinggroup();

//--------------------------------newa feed-------------------------------------------------
let k=0;
function showNewsfeed(data,len){
    let { banner_image, title, url } = data;
    if(data.url===null){
        data.url=`https://cdn.benzinga.com/files/images/story/2023/07/13/screenshot_2023-07-13_at_5.43.42_pm.png?optimize=medium&dpr=1&auto=webp&width=640`
    }
    newscontainer.innerHTML =
          `<img class="news-feed-banner"  src="${data.banner_image}" alt="news-img">
        <div class="news-feed-a-title">
            <p class="news-feed-title">${data.title}</p>
            <a class="newsfeed-anchor-link" href="${data.url}" target="_blank">Read More</a>
        </div>`;

        k++;
        if (k==len-1) {
          k=0;
        }
}
async function getnewsurl(){
   
    let urlkey=`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=QA01E5JHRX1AZD92`;
    try{
    
    let url=await fetch(urlkey);
    let response=await url.json();
   
    let data=await response.feed
        // console.log(data,'response');
     setInterval(() => {
        showNewsfeed(data[k], data.length);
        }, 15000);
    
    }
    catch (error) {
        console.log('Error:', error);
    }
}

getnewsurl();

