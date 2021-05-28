function assignConfiguration(stats,pool){
  console.log(stats,pool)
}
function singleMode(){
  console.log('single mode active')
}
function multiMode(cluster){
  if(cluster.isMaster){
    cluster.fork().on('message',function(message){
      if(message.handshake===0){
        this.send({handshake:1,from:'clusterMaster',withPID:process.pid})
      }
      else if(message.content!==null){
        this.send({content:'handshake finalized',from:'clusterMaster',withPID:process.pid})
      }
      console.log(`clusterMaster ${process.pid} got:`,message)
    })
  }
  else if(cluster.isWorker){
    process.send({handshake:0,from:'clusterWorker',withPID:process.pid})
    process.on('message',function(message){
      if(message.handshake===1){
        process.send({content:'handshake acquired',from:'clusterWorker',withPID:process.pid})
      }
      console.log(`clusterWorker ${process.pid} got:`,message)
    })
  }else{throw new Error(`the multi-mode cluster tried to run an unknown process (not a cluster worker or cluster master - who are you PID #${process.pid}?)`)}
}
export default{assignConfiguration,singleMode,multiMode}