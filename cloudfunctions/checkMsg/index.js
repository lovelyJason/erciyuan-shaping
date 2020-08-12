// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
	try {
    let result = await cloud.openapi.security.msgSecCheck({
      content: event.content
    })
    console.log('result:' + JSON.stringify(result));

    if (result && result.errCode.toString() === '87014') {
      return {
        code: 300,
        msg: '内容含有违法违规内容',
        data: result
      }
    } else {
      return {
        code: 200,
        msg: 'ok',
        data: result
      }
    }

  } catch (err) {
    if (err.errCode.toString() === '87014') {
      return {
        code: 300,
        msg: '内容含有违法违规内容',
        data: err
      }
    }
    return {
      code: 400,
      msg: '调用security接口异常',
      data: err
    }
  }
}