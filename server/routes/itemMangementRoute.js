require('../models/mongo')
const Groccery = require('../models/gorcceryData')
const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.use(authMiddleware)

router.get('/getAll', async (req, res) => {
  try {
    const grocceryItems = await Groccery.find({ userId: req.userId })
    res.status(200).send(grocceryItems)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.post('/add', async (req, res) => {
  const itemDetails = new Groccery({
    ...req.body,
    isPurchased: false,
    userId: req.userId,
  })
  try {
    await itemDetails.save()
    res.status(201).send('success')
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/updatePurchaseStatus', async (req, res) => {
  try {
    await Groccery.findOneAndUpdate(
      { _id: req.body.id, userId: req.userId },
      { isPurchased: true }
    )
    res.status(201).send('success')
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/deleteGrocceryItem', async (req, res) => {
  try {
    await Groccery.findOneAndDelete({ _id: req.body.id, userId: req.userId })
    res.status(200).send('Success')
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router;
