const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const db = require('../configs/db.configs')


const connection = mysql.createConnection(db.database)

connection.connect(function (err) {

    if (err) {
        console.log(err)
    } else {
        var customerTable = "CREATE TABLE IF NOT EXISTS Customer(CustID VARCHAR(6),CustName VARCHAR(30),CustAddress VARCHAR(30),CONSTRAINT PRIMARY KEY(CustID))"
        connection.query(customerTable, function (err, result) {

            if (result.warningCount === 0) {
                console.log("Customer table created")
            }

        })
    }

})

router.post('/', (req, res) => {

    const cust_id = req.body.cust_id;
    const name = req.body.name;
    const address = req.body.address;

    var query = "INSERT INTO Customer (CustID,CustName,CustAddress) VALUES (?,?,?)"

    connection.query(query, [cust_id, name, address], (err, rows) => {
        if (err) {
            res.send({'message': 'Duplicate entry'})
        } else {
            res.send({'message': 'Customer saved'})
        }
    })

})


router.get('/', (req, res) => {

    var query = "SELECT * FROM Customer"

    connection.query(query, (err, rows) => {
        if (err) {
            console.log(err)
        }

        res.send(rows)
    })

})

router.put('/', (req, res) => {

    const cust_id = req.body.cust_id;
    const name = req.body.name;
    const address = req.body.address;

    var query = "UPDATE Customer SET CustName=? , CustAddress=? WHERE CustID=?";

    connection.query(query, [name, address, cust_id], (err, rows) => {
        if (err) {
            console.log(err)
        }

        if (rows.affectedRows > 0) {
            res.send({'message': 'User update'})
        } else {
            res.send({'message': 'User not found'})
        }

    })

})

router.delete('/:cust_id', (req, res) => {
    const cust_id = req.params.cust_id;

    var query = "DELETE FROM Customer WHERE CustID = ?"

    connection.query(query, [cust_id], (err, row) => {
        if (err) {
            console.log(err)
        }

        if (row.affectedRows > 0) {
            res.send({'message': 'Customer deleted'})
        } else {
            res.send({'message': 'Customer deleted fail'})
        }
    })

})

router.get('/cust_id',(req,res)=>{
    const cust_id =  req.params.cust_id;

    var query = "SELECT * FROM Customer WHERE CustID=?"

    connection.query(query,[cust_id],(err,rows)=>{

        if (err) {
            console.log(err)
        }

        if (rows.affectedRows > 0) {
            res.send(rows)
        }else {
            res.send({'message':'Not such a Customer'})
        }

    })

})

module.exports = router
