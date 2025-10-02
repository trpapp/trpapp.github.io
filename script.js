let http_headers = null
if(!(result === null)) console.log("result IS NOT NULL!")

/*swap in all link tag resources marked for projection*/
document.addEventListener("DOMContentLoaded", function() {document.querySelectorAll('link[media=projection]').forEach(link => {link.media='all'})})

/*get ip and tracking info*/
fetch('https://free.freeipapi.com/api/json/', {mode:'cors', method:'GET'}).then(response => response.json()).then(result => console.log(result))

/*clock processing script*/
const AcceptableDrift = 240000 //in milliseconds
const Tick = 4000 //in milliseconds

const ServerTimestamp =
!(http_headers === null)
? new Date(http_headers.get('Date')).getTime()
: null

const UseServerClock =
!(ServerTimestamp === null)
&& (client_timestamp - ServerTimestamp) > AcceptableDrift
? true
: false

document.addEventListener('focus', () => updateClock())
document.addEventListener('visibilitychange', () => {if(document.visibilityState === 'visible') updateClock()})
document.addEventListener('resume', () => updateClock())
//https://developer.chrome.com/docs/web-platform/page-lifecycle-api/image/page-lifecycle-api-state.svg

const Clock =
UseServerClock === true
? new Date(ServerTimestamp)
: new Date(client_timestamp)

clockProc()

function updateClock() {
    Clock.setTime(Clock.getTime() + (Date.now() - client_timestamp))
    client_timestamp = Date.now()
}

function clockProc() {
    updateClock()
    if(document.getElementsByClassName('LiveClockFull').length > 0)
        {for(item of document.getElementsByClassName('LiveClockFull')){item.innerHTML = Clock}}
    if(document.getElementsByClassName('LiveClockYear').length > 0)
        {for(item of document.getElementsByClassName('LiveClockYear')){item.innerHTML = Clock.getFullYear()}}
    setTimeout(() => clockProc(), Tick)
}
