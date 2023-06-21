'use strict'
// 引入scp2
import scp from 'scp2'
import ora from 'ora'
import chalk from 'chalk'
import readline from 'readline'
import ssh2 from 'ssh2'
import path from 'path'
const Client = ssh2.Client
// 下面三个插件是部署的时候控制台美化所用 可有可无
const spinner = ora(chalk.green('正在上传到到服务器...'))

const service = {
  host: '175.178.63.221', //服务器IP
  port: 22, //服务器端口
  username: 'root', // server.username, //服务器ssh登录用户名
  password: 'zcx123A!', // server.password, //服务器ssh登录密码
  path: '/www/wwwroot/nest-im/dist', //服务器web目录
}
let scpClient = scp
scpClient.defaults({
  ...service,
  // ignore: ['node_modules','test'].map(dir=> new RegExp(`${dir}(/|$)`))
})

// 交互语句
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const questions = ['Please input server username: ', 'Please input server password: ']
const linelimit = 2
let inputArr = []
let index = 0
let server = {}

// 依次执行命令行交互语句
// runQueLoop()
// function runQueLoop() {
//   if (index === linelimit) {
//     server['username'] = inputArr[0]
//     server['password'] = inputArr[1]
//     deployFile()
//     return
//   }
//   rl.question(questions[index], (as) => {
//     inputArr[index] = as
//     index++
//     runQueLoop()
//   })
// }

deployFile()
function deployFile() {
  var conn = new Client()
  conn
    .on('ready', async () => {
      try {
        // 删除上个版本的文件
        await exec('rm -rf /www/wwwroot/nest-im/*', conn, {})
        await exec('pm2 list', conn, { cwd: '/www/wwwroot/nest-im' })
        spinner.start()
        // service.path = '/www/wwwroot/nest-im/dist'
        await UploadedFile('./!(node_modules)/**', scpClient)
        await UploadedFile('./*', scpClient)

        await exec('pm2 stop 3', conn, { cwd: '/www/wwwroot/nest-im' })
        await exec('cd /www/wwwroot/nest-im && pnpm i && pnpm run dist', conn, {})
        await exec('cd /www/wwwroot/nest-im && chmod -R 755 ./', conn, {})
        conn.end()
        spinner.stop()
        log('项目上传完成')
      } catch (err) {
        log('发布失败', 'red')
        spinner.stop()
        throw err
      }
    })
    .on('error', () => {
      log('连接服务器失败！', 'red')
    })
    .connect(service)
}

function exec(cmd, conn, options = {}) {
  console.log(chalk.green(`执行命令： ${cmd}`))
  return new Promise((resolve, reject) => {
    conn.exec(cmd, options, (err, stream) => {
      if (err) {
        reject(err)
        throw err
      } else {
        stream
          .on('close', (code, signal) => {
            console.log(code, signal)
            resolve({ code, signal })
          })
          .on('data', function (data) {
            log(data, 'blue')
          })
          .stderr.on('data', function (data) {
            log(data, 'red')
          })
      }
    })
  })
}

function UploadedFile(path, scpClient) {
  return new Promise((resolve, reject) => {
    scpClient.scp(path, service, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

function log(msg, type = 'green') {
  console.log(chalk[type](msg))
}
