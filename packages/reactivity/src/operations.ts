export const enum OperationTypes {
  // using literal strings instead of numbers so that it's easier to inspect
  // debugger events
  //使用文本字符串而不是数字，以便更容易检查
  //调试器事件
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear',
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate'
}
