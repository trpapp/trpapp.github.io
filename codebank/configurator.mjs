import proc from './processor.mjs'

function singleMode(stats,pool){
	proc.assignConfiguration(stats,pool)
}
function multiMode(stats,pool){
	proc.assignConfiguration(stats,pool)
}
export default{singleMode,multiMode}