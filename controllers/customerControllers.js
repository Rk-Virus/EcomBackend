const Order = require("../Models/Order")
const Offer = require("../Models/Offer")
const User = require("../Models/User")
const fetchApi = require("../utils/fetchApi")
const cfSdk = require('cashfree-sdk');
const Payout = require("../Models/Payout");
const {getOrderId} = require("../utils/getUniqueCode");
const { Payouts } = cfSdk;
const { Cashgram } = Payouts;

// CommonOptions for making request to cashfree
const commonOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.X_CLIENT_ID,
        "x-client-secret": process.env.X_CLIENT_SECRET,
        "x-api-version": process.env.X_API_VERSION
    },
}

const acceptPayment = async (req, res) => {
    try {
        const { customerId, offerId } = req.body
        // const customerId = req.user._id
        const customer = await User.findById(customerId)
        let phoneNo = customer.phoneNo
        phoneNo = phoneNo.toString()
        const offer = await Offer.findById(offerId)
        const body = {
            "order_amount": offer.discountedPrice,
            "order_currency": "INR",
            "order_note": "Additional order info",
            "order_meta": {
                return_url: `${process.env.FRONTEND_DOMAIN}/customer/user-page?cf_id={order_id}&cf_token={order_token}`,
            },
            "customer_details": {
                "customer_id": customerId,
                "customer_email": customer.email,
                "customer_phone": phoneNo
            }
        }
        const route = process.env.CASHFREE_PG_URL
        const options = {
            ...commonOptions,
            body: JSON.stringify(body)
        }
        const resp = await fetchApi(route, options)
        if (resp.order_token) {
            res.status(200).json({ msg: "success", response: { orderToken: resp.order_token } })
        } else {
            return res.status(500).json({ msg: "something went wrong" })
        }
    } catch (error) {
        res.status(500).json({ msg: "something went wrong", error: error })
    }
}

const acceptPaymentFromApp = async (req, res) => {
    try {
        const { offerId } = req.params
        const {name, phoneNo, email} = req.user
        const offer = await Offer.findById(offerId)
        let orderId = getOrderId()
        const body = {
            orderId: orderId,
            orderAmount: offer.discountedPrice.toString(),
            orderCurrency: 'INR',
        }
        const route = process.env.CASHFREE_PG_APP_URL
        const options = {
            ...commonOptions,
            body: JSON.stringify(body)
        }
    
        const resp = await fetchApi(route, options)
        if(resp.cftoken){
            const response = {
                ...body,
                tokenData : resp.cftoken,
                appId : process.env.X_CLIENT_ID,
                orderNote: 'Paying to Yoour Helper',
                // notifyUrl: 'http://localhost:8001/api/customer/payment-notification',
                customerName: name,
                customerPhone: phoneNo,
                customerEmail: email,
                color1 : '#f44336',
                color2 : 'white'
            }
            res.status(200).json({ msg: "success", response })
        }else{
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(500).json({ msg: "something went wrong", error: error })
    }
}

// ============Book an Order===============

const bookOrder = async (req, res) => {
    const { offerId, timeSlot, cashfreeDetails, date } = req.body
    if (!offerId  || !timeSlot || !date || !cashfreeDetails) return res.status(400).json({ msg: 'one or more fields required' })
    const slot = timeSlot.split("-")

    const customerId = req.user._id

    if (!offerId || !customerId) {
        return res.status(400).json({ msg: "offerId and customerId are required" })
    }

    try {
        let orderId = cashfreeDetails?.order?.orderId || cashfreeDetails?.orderId

        const route = `${process.env.CASHFREE_PG_URL}/${orderId}`
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-client-id": process.env.X_CLIENT_ID,
                "x-client-secret": process.env.X_CLIENT_SECRET,
                "x-api-version": process.env.X_API_VERSION
            },
        }

        const resp = await fetchApi(route, options)

        if (resp && resp?.order_status === 'PAID') {
            const foundOffer = await Offer.findById(offerId)
            let extraDays = 0
            const customerWhoBooked = await User.findById(customerId)
            if (foundOffer.extraInfo.isSpecialOffer && customerWhoBooked.joinedThruRefferal) {
                // Offer applicable on first order
                const resp = await Order.exists({ customer: customerId })
                const isFirstOrder = !resp
                if (isFirstOrder) {
                    const customerToBeRewarded = await User.findOne({ refferalId: customerWhoBooked.joinedThruRefferal })
                    customerToBeRewarded.refferalCount += foundOffer.extraInfo.specialRefCount
                    await customerToBeRewarded.save()
                    extraDays = 7
                }
            }

            // let startHr = slot[0].split(":")[0]
            // let startMin = slot[0].split(":")[1]

            // let endHr = slot[1].split(":")[0]
            // let endMin = slot[1].split(":")[1]

            let startDate = new Date(date)
            startDate.setDate(startDate.getDate())
            startDate.setHours(Number(slot[0]))
            startDate.setMinutes(0)
            startDate.setSeconds(0)

            let endDate = new Date(date);
            endDate.setDate(endDate.getDate() + foundOffer.validity - 1 + extraDays);
            endDate.setHours(Number(slot[1]))
            endDate.setMinutes(0)
            endDate.setSeconds(0)

            let newOrder = {
                offer: offerId,
                customer: customerId,
                startsAt: startDate,
                endsAt: endDate,
                cashfreeDetails
            }
            const order = new Order(newOrder)
            const savedOrder = await order.save()

            return res.status(200).json({ msg: "success", response: {...savedOrder.toObject(), extraDays} })
        } else {
            return res.status(400).json({ msg: "Payment not done" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

const redeemWallet = async (req, res) => {
    if(req.user.refferalCount === 0){
        return res.status(400).json({msg : "You don't have enough money to redeem"})
    }
    const config = {
        Payouts: {
            ClientID: process.env.CASHGRAM_CLIENT_ID,
            ClientSecret: process.env.CASHGRAM_CLIENT_SECRET,
            ENV: process.env.CASHFREE_MODE,
            publicKey : process.env.CASHGRAM_PUBLIC_KEY
        }
    }
    
    Payouts.Init(config.Payouts);
    try {
        const cashgramId = req.user.userId +'_' + Date.now()
        const linkExpireDate = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + (new Date().getDate() + 1)
        const cashgram = {
            cashgramId: cashgramId,
            amount: req.user.refferalCount,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phoneNo,
            linkExpiry: linkExpireDate,
            remarks: "Redeem Your Wallet Money",
            notifyCustomer: 1
        };

        //create cashgram
        const response = await Cashgram.CreateCashgram(cashgram);
        if(response.status === "ERROR"){
            return res.status(500).json({msg : 'something went wrong'})
        }
        const newPayout = new Payout({
            cashgramId: cashgramId,
            amount: req.user.refferalCount,
            customer : req.user._id
        })
        await newPayout.save()
        res.status(200).json({msg : 'success', response : response.data.cashgramLink})

    } catch (error) {
        console.log("err caught in creating cashgram");
        console.log(err);
    }
}

const cashGramWebHook = async (req, res) => {
    let webhookPostDataJson = JSON.stringify(req.body)
    Payouts.VerifySignature(webhookPostDataJson, req.body.signature, process.env.CASHGRAM_CLIENT_SECRET);
    // d31d-103-112-17-193.in.ngrok.io/api/customer/cashgram-webhook
    if(req.body.event === 'CASHGRAM_REDEEMED'){
        const foundPayout = await Payout.findOne({cashgramId : req.body.cashgramId})
        const foundUser = await User.findById(foundPayout.customer)
        foundUser.refferalCount -= foundPayout.amount
        const updatedCustmr = await foundUser.save()
        console.log({updatedCustmr})
    }
    res.status(200).json({msg : 'recieved'})
}

const fetchCustomer = async (req, res) => {
    try {
        const custId = req.params.custId
        const foundCustomer = await User.findById(custId).select("-password")
        res.status(200).json({ msg: "success", response: foundCustomer })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

const getActiveOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id, endsAt: { $gte: Date.now() } })
            .populate('employeeAllocated', 'userId phoneNo name profilePic')
            .populate('offer')

        res.status(200).json({ msg: 'success', response: orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "something went wrong", error: error })
    }
}

const getPreviousOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id, endsAt: { $lt: Date.now() } })
            .populate('employeeAllocated', 'userId phoneNo name profilePic')
            .populate('offer')

        res.status(200).json({ msg: 'success', response: orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "something went wrong", error: error })
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('employeeAllocated', 'userId phoneNo name profilePic')
            .populate('offer')
        if (!order) return res.status(404).json({ msg: 'Order not found' })

        let orderStatus;
        if (order.endsAt > Date.now()) {
            orderStatus = 'ACTIVE'
        } else {
            orderStatus = 'EXPIRED'
        }
        res.status(200).json({ msg: 'success', response: { order, orderStatus } })
    } catch (error) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

module.exports = { acceptPayment, acceptPaymentFromApp, redeemWallet, cashGramWebHook, bookOrder, fetchCustomer, getActiveOrders, getPreviousOrders, getSingleOrder }
