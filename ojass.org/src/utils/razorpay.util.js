import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
let razorpayInstance = null;

const getRazorpayInstance = () => {
    if (!razorpayInstance) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error('Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
        }

        razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }

    return razorpayInstance;
};

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in paise (e.g., 50000 for ₹500.00)
 * @param {string} currency - Currency code (default: 'INR')
 * @param {Object} options - Additional options (receipt, notes, etc.)
 * @returns {Promise<Object>} Razorpay order object
 */
export const createOrder = async (amount, currency = 'INR', options = {}) => {
    try {
        const razorpay = getRazorpayInstance();

        const orderData = {
            amount: amount, // Amount in paise
            currency: currency,
            receipt: options.receipt || `receipt_${Date.now()}`,
            ...options,
        };

        const order = await razorpay.orders.create(orderData);

        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
            created_at: order.created_at,
        };
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw new Error(`Failed to create Razorpay order: ${error.message || error.description}`);
    }
};

/**
 * Verify Razorpay payment signature
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 * @param {string} razorpaySignature - Razorpay signature
 * @returns {boolean} true if signature is valid, false otherwise
 */
export const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    try {
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keySecret) {
            throw new Error('RAZORPAY_KEY_SECRET is not configured');
        }

        // Create signature
        const generatedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        // Compare signatures
        const isSignatureValid = generatedSignature === razorpaySignature;

        return isSignatureValid;
    } catch (error) {
        console.error('Error verifying payment signature:', error);
        return false;
    }
};

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
    try {
        const razorpay = getRazorpayInstance();

        const payment = await razorpay.payments.fetch(paymentId);

        return {
            id: payment.id,
            entity: payment.entity,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            order_id: payment.order_id,
            method: payment.method,
            description: payment.description,
            created_at: payment.created_at,
            notes: payment.notes || {},
        };
    } catch (error) {
        console.error('Error fetching payment details:', error);
        throw new Error(`Failed to fetch payment details: ${error.message || error.description}`);
    }
};

/**
 * Get order details from Razorpay
 * @param {string} orderId - Razorpay order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderDetails = async (orderId) => {
    try {
        const razorpay = getRazorpayInstance();

        const order = await razorpay.orders.fetch(orderId);

        return {
            id: order.id,
            entity: order.entity,
            amount: order.amount,
            amount_paid: order.amount_paid,
            amount_due: order.amount_due,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
            created_at: order.created_at,
            notes: order.notes || {},
        };
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error(`Failed to fetch order details: ${error.message || error.description}`);
    }
};

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund in paise (optional, refunds full amount if not specified)
 * @param {Object} notes - Additional notes for refund
 * @returns {Promise<Object>} Refund details
 */
export const refundPayment = async (paymentId, amount = null, notes = {}) => {
    try {
        const razorpay = getRazorpayInstance();

        const refundData = {
            ...(amount && { amount: amount }),
            notes: notes,
        };

        const refund = await razorpay.payments.refund(paymentId, refundData);

        return {
            id: refund.id,
            entity: refund.entity,
            amount: refund.amount,
            currency: refund.currency,
            payment_id: refund.payment_id,
            status: refund.status,
            created_at: refund.created_at,
            notes: refund.notes || {},
        };
    } catch (error) {
        console.error('Error processing refund:', error);
        throw new Error(`Failed to process refund: ${error.message || error.description}`);
    }
};

/**
 * Convert amount to paise (Razorpay uses paise for INR)
 * @param {number} amountInRupees - Amount in rupees
 * @returns {number} Amount in paise
 */
export const convertToPaise = (amountInRupees) => {
    return Math.round(amountInRupees * 100);
};

/**
 * Convert amount from paise to rupees
 * @param {number} amountInPaise - Amount in paise
 * @returns {number} Amount in rupees
 */
export const convertFromPaise = (amountInPaise) => {
    return amountInPaise / 100;
};

