let http_headers = null
if(!(result === null)) console.log("result IS NOT NULL!")

/*swap in all link tag resources marked for projection*/
document.addEventListener("DOMContentLoaded", function() {document.querySelectorAll('link[media=projection]').forEach(link => {link.media='all'})})

/*get ip and tracking info*/
fetch('https://free.freeipapi.com/api/json/', {mode:'cors', method:'GET'}).then(response => response.json()).then(result => console.log(result))

/*clock processing script*/
const AcceptableDrift = 240000 //in milliseconds
const Tick = 4000 //in milliseconds

const ServerClockLocalized =
!(http_headers === null)
? new date(new date(http_headers.get('Date'))
    .toLocaleString(LocaleLanguageRegion, {timeZone:LocaleJurisdiction}))
: null

const UseServerClock =
!(ServerClockLocalized === null)
&& (localized_client_clock.getTime() - ServerClockLocalized.getTime()) > AcceptableDrift
? true
: false

document.addEventListener('focus', () => updateClock())
document.addEventListener('visibilitychange', () => {if(document.visibilityState === 'visible') updateClock()})
document.addEventListener('resume', () => updateClock())
//https://developer.chrome.com/docs/web-platform/page-lifecycle-api/image/page-lifecycle-api-state.svg

let clock =
UseServerClock === true
? new date(ServerClockLocalized.getTime())
: new Date(localized_client_clock.getTime())

clockProc()

function updateClock() {
    let timestamp = new date(new date().toLocaleString(LocaleLanguageRegion, {timeZone:LocaleJurisdiction}))
    clock = new date(clock.getTime() + (timestamp.getTime() - localized_client_clock.getTime()))
    localized_client_clock = timestamp
}

function clockProc() {
    updateClock()
    if(document.getElementsByClassName('LiveClockFull').length > 0)
        {for(item of document.getElementsByClassName('LiveClockFull')){item.innerHTML = clock}}
    if(document.getElementsByClassName('LiveClockYear').length > 0)
        {for(item of document.getElementsByClassName('LiveClockYear')){item.innerHTML = clock.getFullYear()}}
    setTimeout(() => clockProc(), Tick)
}
