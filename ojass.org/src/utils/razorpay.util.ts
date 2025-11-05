import Razorpay from 'razorpay';
import crypto from 'crypto';

// Define the shape of the Razorpay instance
interface RazorpayInstance {
    orders: {
        create(data: any): Promise<any>;
        fetch(orderId: string): Promise<any>;
    };
    payments: {
        fetch(paymentId: string): Promise<any>;
        refund(paymentId: string, data: any): Promise<any>;
    };
}

// Initialize Razorpay instance as a type-casted variable
let razorpayInstance: RazorpayInstance | null = null;

/**
 * Ensures a single, initialized instance of the Razorpay client.
 * @returns {RazorpayInstance} The initialized Razorpay client instance.
 */
const getRazorpayInstance = (): RazorpayInstance => {
    if (!razorpayInstance) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error('Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
        }

        // The Razorpay constructor returns an object that matches our RazorpayInstance interface.
        // We cast it to ensure TypeScript knows its shape.
        razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        }) as unknown as RazorpayInstance; 
    }

    return razorpayInstance;
};

// --- Interfaces for Exported Functions ---

interface OrderOptions {
    receipt?: string;
    notes?: { [key: string]: string | number };
    [key: string]: any; // Allow other properties like payment_capture
}

interface OrderResult {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
}

interface OrderDetails {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
    notes: { [key: string]: string | number };
}

interface PaymentDetails {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    description: string;
    created_at: number;
    notes: { [key: string]: string | number };
}

interface RefundDetails {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    payment_id: string;
    status: string;
    created_at: number;
    notes: { [key: string]: string | number };
}

// --- Exported Functions ---

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in paise (e.g., 50000 for ₹500.00)
 * @param {string} [currency='INR'] - Currency code (default: 'INR')
 * @param {OrderOptions} [options={}] - Additional options (receipt, notes, etc.)
 * @returns {Promise<OrderResult>} Razorpay order object
 */
export const createOrder = async (
    amount: number, 
    currency: string = 'INR', 
    options: OrderOptions = {}
): Promise<OrderResult> => {
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
            id: order.id as string,
            amount: order.amount as number,
            currency: order.currency as string,
            receipt: order.receipt as string,
            status: order.status as string,
            created_at: order.created_at as number,
        };
    } catch (error: any) {
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
export const verifyPaymentSignature = (
    razorpayOrderId: string, 
    razorpayPaymentId: string, 
    razorpaySignature: string
): boolean => {
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
        // Using crypto.timingSafeEqual is generally better for signature comparison 
        // to prevent timing attacks, but sticking to original logic for no functional change.
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
 * @returns {Promise<PaymentDetails>} Payment details
 */
export const getPaymentDetails = async (paymentId: string): Promise<PaymentDetails> => {
    try {
        const razorpay = getRazorpayInstance();

        const payment = await razorpay.payments.fetch(paymentId);

        return {
            id: payment.id as string,
            entity: payment.entity as string,
            amount: payment.amount as number,
            currency: payment.currency as string,
            status: payment.status as string,
            order_id: payment.order_id as string,
            method: payment.method as string,
            description: payment.description as string,
            created_at: payment.created_at as number,
            notes: payment.notes || {},
        };
    } catch (error: any) {
        console.error('Error fetching payment details:', error);
        throw new Error(`Failed to fetch payment details: ${error.message || error.description}`);
    }
};

/**
 * Get order details from Razorpay
 * @param {string} orderId - Razorpay order ID
 * @returns {Promise<OrderDetails>} Order details
 */
export const getOrderDetails = async (orderId: string): Promise<OrderDetails> => {
    try {
        const razorpay = getRazorpayInstance();

        const order = await razorpay.orders.fetch(orderId);

        return {
            id: order.id as string,
            entity: order.entity as string,
            amount: order.amount as number,
            amount_paid: order.amount_paid as number,
            amount_due: order.amount_due as number,
            currency: order.currency as string,
            receipt: order.receipt as string,
            status: order.status as string,
            created_at: order.created_at as number,
            notes: order.notes || {},
        };
    } catch (error: any) {
        console.error('Error fetching order details:', error);
        throw new Error(`Failed to fetch order details: ${error.message || error.description}`);
    }
};

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number | null} [amount=null] - Amount to refund in paise (optional, refunds full amount if not specified)
 * @param {Object} [notes={}] - Additional notes for refund
 * @returns {Promise<RefundDetails>} Refund details
 */
export const refundPayment = async (
    paymentId: string, 
    amount: number | null = null, 
    notes: { [key: string]: string } = {}
): Promise<RefundDetails> => {
    try {
        const razorpay = getRazorpayInstance();

        const refundData: { amount?: number; notes: { [key: string]: string } } = {
            notes: notes,
        };

        if (amount !== null) {
            refundData.amount = amount;
        }

        const refund = await razorpay.payments.refund(paymentId, refundData);

        return {
            id: refund.id as string,
            entity: refund.entity as string,
            amount: refund.amount as number,
            currency: refund.currency as string,
            payment_id: refund.payment_id as string,
            status: refund.status as string,
            created_at: refund.created_at as number,
            notes: refund.notes || {},
        };
    } catch (error: any) {
        console.error('Error processing refund:', error);
        throw new Error(`Failed to process refund: ${error.message || error.description}`);
    }
};

/**
 * Convert amount to paise (Razorpay uses paise for INR)
 * @param {number} amountInRupees - Amount in rupees
 * @returns {number} Amount in paise
 */
export const convertToPaise = (amountInRupees: number): number => {
    return Math.round(amountInRupees * 100);
};

/**
 * Convert amount from paise to rupees
 * @param {number} amountInPaise - Amount in paise
 * @returns {number} Amount in rupees
 */
export const convertFromPaise = (amountInPaise: number): number => {
    return amountInPaise / 100;
};