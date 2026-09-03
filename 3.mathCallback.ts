
type calcFunction = (num: number) => void

const calcFun=(a:number,b:number,resultFun:calcFunction):void=>{
    const result= a+b
    resultFun(result)
}

const resultFun=(result:number):void=>{
    console.log(`The result is: ${result}`)

}

calcFun(5,10,resultFun)