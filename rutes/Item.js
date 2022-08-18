const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const db = require('../configs/db.configs')


const connection = mysql.createConnection(db.database)

connection.connect(function (err) {

    if (err) {
        console.log(err)
    } else {
        var itemTable = "CREATE TABLE IF NOT EXISTS Item(ItemCode VARCHAR(6),Description VARCHAR(50),UnitPrice DECIMAL(6,2),QtyOnHand int(5),CONSTRAINT PRIMARY KEY(ItemCode))"
        connection.query(itemTable, function (err, result) {
            if (result.warningCount === 0) {
                console.log("Item table created")
            }

        })
    }

})

router.post('/',(req,res)=>{

    const itemCode = req.body.itemCode;
    const description = req.body.description;
    const unitPrice = req.body.unitPrice;
    const qtyOnHand = req.body.qtyOnHand;

    var query = "INSERT INTO Item (ItemCode,Description,UnitPrice,QtyOnHand) VALUES (?,?,?,?) "

    connection.query(query,[itemCode,description,unitPrice,qtyOnHand],(err,rows)=>{
        if (err) {

            res.send({'message':"item doesn't saved"})
        }else {
            res.send({'message':'item saved'})
        }
    })

})

router.get('/',(req,res)=>{

    var query = "SELECT * FROM Item"

    connection.query(query,[],(err,rows)=>{

        if (err) {
            console.log(err)
        }

        res.send(rows)
    })

})

router.put('/',(req,res)=>{
    const itemCode = req.body.itemCode;
    const description = req.body.description;
    const unitPrice = req.body.unitPrice;
    const qtyOnHand = req.body.qtyOnHand;

    var query = "UPDATE Item SET Description=?,UnitPrice=?,QtyOnHand=? WHERE ItemCode=?"

    connection.query(query,[description,unitPrice,qtyOnHand,itemCode],(err,rows)=>{
        if (err) {
            res.send({'message':"item doesn't updated"})
        }else {
            res.send({'message':'item Updated'})
        }
    })
})

router.delete('/itemCode',(req,res)=>{
    const itemCode = req.params.itemCode;

    var query = "DELETE FROM Item WHERE ItemCode=?"

    connection.query(query,[itemCode],(err,rows)=>{
        if (err) {
            res.send({'message':"item doesn't deleted"})
        }else {
            res.send({'message':'item deleted'})
        }
    })

})

router.get('/itemCode',(req,res)=>{
    const itemCode = req.params.itemCode;

    var query = "SELECT * FROM Item WHERE ItemCode=?"

    connection.query(query,[itemCode],(err,rows)=>{
        if (err) {
            res.send({'message':'Not Such a Item'})
        }

        res.send(rows)
    })
})

module.exports = router