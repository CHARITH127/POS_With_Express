const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const db = require('../configs/db.configs')
const item = require('./Item')

const connection = mysql.createConnection(db.database)

connection.connect(function (err) {

    if (err) {
        console.log(err)
    } else {
        var orderTable = "CREATE TABLE IF NOT EXISTS Orders(OrderID VARCHAR(6),OrderDate DATE,CustID VARCHAR(6),Cost DECIMAL(6,2),CONSTRAINT PRIMARY KEY (OrderID),CONSTRAINT FOREIGN KEY(CustID) REFERENCES Customer(CustID)ON DELETE CASCADE ON UPDATE CASCADE)"
        connection.query(orderTable, function (err, result) {
            if (result.warningCount === 0) {
                console.log("Order table created")
            }

        })

        var orderDetailsTable = "CREATE TABLE IF NOT EXISTS OrderDetails(ItemCode VARCHAR(6),OrderID VARCHAR(6),OrderQty INT(11),Price DOUBLE(6,2),CONSTRAINT PRIMARY KEY (ItemCode, OrderID),CONSTRAINT FOREIGN KEY (ItemCode) REFERENCES Item(ItemCode) ON DELETE CASCADE ON UPDATE CASCADE ,CONSTRAINT FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE ON UPDATE CASCADE)"
        connection.query(orderDetailsTable, function (err, result) {
            if (err) {
                console.log(err)
            }
            if (result.warningCount === 0) {
                console.log("Order table created")
            }
        })
    }

})


router.get('/', (req, res) => {

    var query = "SELECT * FROM Orders"

    connection.query(query, (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            res.send(rows);
        }
    })

})

router.post('/', (req, res) => {

    const orderId = req.body.orderId;
    const orderDate = req.body.orderDate;
    const custId = req.body.custId;
    const cost = req.body.cost;
    const orderDetails = req.body.orderDetails;

    var saveOrderQuery = "INSERT INTO Orders (OrderID,OrderDate,CustID,Cost) VALUES (?,?,?,?)"

    connection.query(saveOrderQuery, [orderId, orderDate, custId, cost], (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            for (const orderDetail of orderDetails) {
                var saveOrderDetailsQuery = "INSERT INTO OrderDetails(ItemCode,OrderID,OrderQty,Price) VALUES (?,?,?,?)"

                connection.query(saveOrderDetailsQuery, [orderDetail.itemCode, orderDetail.orderId, orderDetail.orderQty, orderDetail.price], (err, rows) => {
                    if (err) {
                        console.log(err)
                    } else {
                        let itemCode = orderDetail.itemCode
                        let itemQty = orderDetail.orderQty

                        var updateItemQtyQuery = "UPDATE Item SET QtyOnHand=(QtyOnHand-?) WHERE ItemCode=?"
                        connection.query(updateItemQtyQuery, [itemQty, itemCode], (err, rows) => {

                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                })
            }

            res.send("Order Successfully places")

        }

    })
})

router.get('/:orderId', (req, res) => {

    const orderId = req.params.orderId;

    var query = "SELECT * FROM OrderDetails WHERE OrderID=?"

    connection.query(query, [orderId], (err, rows) => {
        if (err) {
            console.log(err)
        }

        res.send(rows);
    })

})


module.exports = router
