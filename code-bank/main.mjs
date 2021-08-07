import {workerpool,sidh,alasql,configurator,processor} from './codeloader.mjs'

const cpuCount=2//workerpool.cpus
const thisPool=workerpool.pool()
const forkCount=(cpuCount<2)?(cpuCount<=0)?0:1:Math.floor(cpuCount)

const keyPair/*:{privateKey:Uint8Array;publicKey:Uint8Array}*/=await sidh.keyPair()
const plaintext/*:Uint8Array*/=new Uint8Array([104,101,108,108,111,0])//"hello"
const encrypted/*:Uint8Array*/=await sidh.encrypt(plaintext,keyPair.publicKey)
const decrypted/*:Uint8Array*/=await sidh.decrypt(encrypted,keyPair.privateKey)//same as plaintext

console.log(keyPair)
console.log(plaintext)
console.log(encrypted)
console.log(decrypted)

//quorumNeeded > 2n-1=x (if n=1, offline; if n=2, online & force x to =2 via 2n-2=x; if n>2 then 2n-1=x may resolve)
/*
alasql("CREATE TABLE cities (city string,population number)")
alasql("INSERT INTO cities VALUES ('Paris',2249975),('Berlin',3517424),('Madrid',3041579)")
var result=alasql("SELECT * FROM cities WHERE population < 3600000 ORDER BY population DESC")
console.log(result)
*/
alasql.promise([
	"CREATE TABLE cities (city string,population number)",
	"INSERT INTO cities VALUES ('Paris',2249975),('Berlin',3517424),('Madrid',3041579)",
	"SELECT * FROM cities WHERE population < 3500000 ORDER BY population DESC"
]).then(function(result){console.log('ALASQL Result:',result.pop())})
.catch(function(error){console.log('ALASQL',error)})

/*Single process+pool mode*/
if(workerpool.platform==='browser'){configurator.singleMode(statsFor('browserPlatformProcess'),thisPool);processor.singleMode()}
/*Single or multiple process+pool mode*/
else if(workerpool.platform==='node'){
	/*Single process+pool mode*/
	if(forkCount===1){configurator.singleMode(statsFor('unitaryGenesisProcess'),thisPool);processor.singleMode()}
	/*Multiple process+pool mode*/
	else if(forkCount>1){
		import('cluster').then((cluster)=>{
			/*Multiple process+pool mode when clusterMaster*/
			if(cluster.isMaster){configurator.multiMode(statsFor('clusterGenesisProcess'),thisPool);for(var i=1;i<forkCount;i++){processor.multiMode(cluster)}}
			/*Multiple process+pool mode when clusterWorker*/
			else if(cluster.isWorker){configurator.multiMode(statsFor('clusterSpawnedProcess'),thisPool);processor.multiMode(cluster)}
			else{throw new Error(`the cluster import initialized some kind of rogue process (not a cluster worker or cluster master - who are you PID #${process.pid}?)`)}
		})
	}else{throw new Error('cpu and/or fork count was initialized incorrectly (fork count deliberately set to 0?)')}
}else{throw new Error('the platform type was not initialized to \'browser\' or \'node\' (unknown platform?)')}

function statsFor(thisProcessType){
	const processId=(workerpool.platform==='browser'||workerpool.platform==='node')?(workerpool.platform==='browser')?null:process.pid:(function(){throw new Error('cannot evaluate platform type for processId')})
	return Object.assign({cpuCount:Number(cpuCount),forkCount:Number(forkCount),platformType:String(workerpool.platform),processType:thisProcessType,processId:processId},thisPool.stats())
}
/*\
*	https://stackoverflow.com/questions/32604460/xmlhttprequest-module-not-defined-found
*	axios, xhr2 libraries
\*/
/*
function printRepoCount(){console.log(this.responseText)}

var request=new XMLHttpRequest()
request.onload=printRepoCount
request.open('get','https://cdn.jsdelivr.net/npm/alasql/dist/alasql.js',true)
request.send()
*/