let httpHeaderResponseHeaders = null

/*swap in all link tag resources marked for projection*/
document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll('link[media=projection]').forEach(link=>{link.media='all'});})

/*get ip and tracking info (only works independently/locally)*/
//fetch('https://api.ipify.org/', {mode:'cors', method:'GET'}).then(response => response.text()).then(result => {return fetch(`http://ip-api.com/json/${result}`, {mode:'cors', method:'GET'})}).then(response => response.json()).then(result => console.log(result))

/*clock processing script*/
const acceptableDrift = 120000 //in milliseconds
const tick = 4000 //in milliseconds

const serverClockLocalized =
!(httpHeaderResponseHeaders === null)
? new Date(new Date(httpHeaderResponseHeaders.get('Date'))
    .toLocaleString(localeLanguageRegion,{timeZone:localeJurisdiction}))
: null

const useServerClock =
!(serverClockLocalized === null)
&& (localizedClientClock.getTime() - serverClockLocalized.getTime()) > acceptableDrift
? true
: false

document.addEventListener('focus', () => updateClock())
document.addEventListener('visibilitychange', () => {if(document.visibilityState === 'visible'){updateClock()}})
document.addEventListener('resume', () => updateClock())
//https://developer.chrome.com/docs/web-platform/page-lifecycle-api/image/page-lifecycle-api-state.svg

let clock =
useServerClock === true
? new Date(serverClockLocalized.getTime())
: new Date(localizedClientClock.getTime())

clockProc()

function updateClock() {
    let timestamp = new Date(new Date().toLocaleString(localeLanguageRegion,{timeZone:localeJurisdiction}))
    clock = new Date(clock.getTime() + (timestamp.getTime() - localizedClientClock.getTime()))
    localizedClientClock = timestamp
}

function clockProc() {
    updateClock()
    if(document.getElementsByClassName('liveClockFull').length > 0)
        {for(item of document.getElementsByClassName('liveClockFull')){item.innerHTML=clock}}
    if(document.getElementsByClassName('liveClockYear').length > 0)
        {for(item of document.getElementsByClassName('liveClockYear')){item.innerHTML=clock.getFullYear()}}
    setTimeout(() => clockProc(), tick)
}
