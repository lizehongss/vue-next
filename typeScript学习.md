## typeScript学习
- 泛型

```
function identity<T>(arg: T): T {
  return arg;
}
T获取用户输入的类型，然后使用这个类型作为返回值类型
```
使用方法
```
let output = identity<srting>("myString")
let output = identit("myString")
第二种方法使用类型推论根据传入的类型为**String**类型确定T类型
```

同时泛型也可如下使用
```
function loggingIdentity<T>(arg: Array[T]): Array<T> {
  console.log(arg.length)
  return arg;
}
接收一个元素类型为T的数组并返回元素类型为T的数组
```
泛型接口
```
interface GenericIdentityFn <T> {
  (arg:T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```
泛型类
```
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y:T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x,y) {return x+y; };

```
泛型约束
```
使用上面的loggingIdentity函数，约束传入的类型具有length属性
interface Lengthwise {
  length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T) : T {
  console.log(arg.length)
}
```
- 接口
 在typeScript里, 接口的作用是对值所具有的结构进行类型命名和定义契约
 ```
 interface LabelledValue {
   color: string
   label ?: string; // 参数可选
   readonly x: number //只读属性
   (source: string, subString: string): boolean; //函数类型
   [index: number]: string; //索引签名

 }

  function printLabel(labelledObj: LabelledValue) {

  }

 ```
 接口可继承
 ```
 interface Shape {
   color: string;
 }

 interface Square extends Shape {
   sideLength: number;
 }
 ```

- 基础类型
1. 基础类型定义
```
//布尔值
let isDone: boolean = false
//数字
let  decLiteral: number = 6
//字符串
let name: string = "bob";
let sentence: string = `Hello, my name is $ { name }`
// 数组
let list: number[] = [1,2,3];
let list: Array<number> = [1,2,3];
// 元组 Tuple
let x: [string,number]; 
// 表示一个已知元素数量和类型的数组,当访问一个越界的元素时，会使用联合类型替代
// 枚举
enum Color {Red,Green, Blue}
let c: Color = Color.Green;
// Any
let notSure: any =4;
// 允许在编译时可选择地包含或移除类型检查
// void 表示没有任何类型,常见于函数没有返回值
let unusable: void = undefined;
// Null和Undefined 用处不是很大
let u: undefined = undefinded;
let n: null = null;
// Never 表示永不存在的值的类型
// Object 表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。
declare function create(o: object | null): void;
//类型断言
let someValue： any = "this is  a string";
let strLength: number = (<string>someValue).length;

let strLength: number = (someValue as string).length;
```

- 类
```
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello," + this.greeting;
  }
}

let greeter = new Greeter("world")
```
继承使用如下

```
class exGreeter extends Greeter {
  constructor(message: string) {
    super(message) //执行基类的构造函数
  }
  bark() {
    // code something
  }
}
```
公共，私有与受保护的修饰符