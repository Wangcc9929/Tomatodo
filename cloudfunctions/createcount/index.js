// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(111)
    return await db.collection('logs').add({
      data: {
        date:event.date,
        things: event.things,
        time: event.time,
        openid: event.openid
      }
    })
  } catch (e) {
    console.log(e)
  }
}