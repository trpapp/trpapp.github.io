const Numbers = {
	ZERO: 0,
	ONE: 1,
	TWO: 2
}

console.log(Numbers.TWO+ ' has size: '+ String(Numbers.TWO).length)

const Colors = {
	RED: Symbol('RED'),
	GREEN: Symbol('GREEN'),
	BLUE: Symbol('BLUE')
}

const len = new Blob(Colors.GREEN);
console.log(String(Colors.GREEN)+ ' has size: '+ len.size)
