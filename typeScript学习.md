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

基础类型定义
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
默认为**public**可以自由访问程序里定义的成员
**private**不能在声明它的类的外部访问
**protected** 在派生类中仍然可以访问
**readonly** 将关键字属性设置为只读,只读属性必须在声明时或构造函数里被初始化
存取器
支持通过getters/setters来截取对对象成员的访问
```
class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName
  }
  set fullName(newName: string) {
    if () {
      //code somthong
    } else {
      //code something
    }
  }
}
```
**static**定义静态属性, 每个实例想要访问这个属性时,要在origin前面加上类名.
**abstract**定义抽象类,抽象类中的抽象方法不包含具体实现并且必须在派生类中实现.
```
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```
- 函数

函数完整类型
```
let myAdd: (x: number, y: number) => number = function(x:number, y:number): number { return x + y};
```
可使用 **?** 让参数可选择
```
function buildName(firstName: string, lastName?: string) {
  if (lastName)
    return firstName + " " + lasteName;
  else 
    return firstName
}
// 可选参数必须跟在必须参数后面
```
可为参数提供一个默认值
```
function buildName (firstName: string, lastName = "smith") {
  // code something
}
```
可将所有参数收集到一个变量里
```
function buildName(firstName: string, ...restOfName: string[]) {
  // code something
}
```
**重载的实现**：为同一个函数提供多个函数类型定义来进行函数重载
```
function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
```
- 枚举
1. 数字枚举
```
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
//Up值为1，Down值为2，以此类推
```
2. 字符串枚举
```
enum Direction {
  Up = "Up",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}
```
3. 异构枚举
```
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```
