# Como rodar teste

- no package.json tem que mudar o test para jest
- no terminal, só rodar npm run test
- no link há instuções https://stackoverflow.com/questions/63114333/how-to-import-mjs-modules-in-jests-xyz-test-jsv

# Dicas mongo

# Path

- C:\Program Files\MongoDB\Server\8.0
- C:\Users\ricar\AppData\Local\Programs\mongosh

# comandos

- net start MongoDB
- net stop MongoDB

- mongod
- mongoimport

- mongosh
- use admin

db.createUser({
user: "admin",
pwd: "1903",
roles: [ {
role: "readWrite",
db: "admin" }
]
})

db.createUser({
user: "admin2",
pwd: "1903",
roles: [
{role: "userAdminAnyDatabase", db: "admin" },
{role: "readWriteAnyDatabase", db: "admin" },
]})

mongosh -u admin2 -p 1903 --authenticationDatabase "admin"

db.getUsers()

use test
db.createCollection('example')
db.example.insertOne({name: "Teste"})
db.example.find()

db.createUser({
user: "batata",
pwd: "69",
roles: [
{role: "readWrite", db: "test" },
]})

mongosh -u batata -p 69 --authenticationDatabase "test"

db.readWriteCollection.insertOne({name: "Teste2"})
db.readWriteCollection.find()

mongodb://<username>:<password>@<host>:<port>/<database>?<options>
mongodb://admin:1903@localhost:27017/admin
mongodb://batata:69@localhost:27017/test
