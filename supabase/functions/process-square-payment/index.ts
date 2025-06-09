import { Client, Environment, ApiError } from 'npm:squareup@29.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  console.log('=== Square Payment Request ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  try {
    console.log('Processing Square payment...')
    
    // Initialize Square client
    const client = new Client({
      accessToken: 'EAAAl6Tsia6s-nkfh0z1t1kh8pnPBz7Qj5GCzf5jyN6XAMCYuQVKEIUaBwaqLCK8',
      environment: Environment.Sandbox
    })

    // Parse request body
    const requestText = await req.text()
    console.log('Raw request body:', requestText)
    
    if (!requestText) {
      throw new Error('Request body is empty')
    }

    let requestData
    try {
      requestData = JSON.parse(requestText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      throw new Error('Invalid JSON in request body')
    }

    console.log('Parsed request data:', requestData)

    const { sourceId, amount, orderId, currency = 'USD' } = requestData

    if (!sourceId || !amount || !orderId) {
      throw new Error('sourceId, amount, and orderId are required')
    }

    // Convert amount to cents for Square
    const amountInCents = Math.round(parseFloat(amount) * 100)

    console.log('Creating Square payment with:', {
      amountInDollars: amount,
      amountInCents,
      currency,
      orderId,
      sourceId
    })

    // Create payment request
    const paymentsApi = client.paymentsApi
    
    const requestBody = {
      sourceId: sourceId,
      idempotencyKey: `${orderId}-${Date.now()}`, // Unique key for this payment
      amountMoney: {
        amount: BigInt(amountInCents),
        currency: currency
      },
      note: `African Snakie Order #${orderId.slice(0, 8)}`,
      autocomplete: true,
      referenceId: orderId
    }

    console.log('Square payment request:', requestBody)

    const response = await paymentsApi.createPayment(requestBody)

    if (response.result.payment) {
      const payment = response.result.payment
      
      console.log('Payment created successfully:', {
        id: payment.id,
        status: payment.status,
        amount: payment.amountMoney?.amount,
        currency: payment.amountMoney?.currency
      })

      const responseData = {
        success: true,
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amountMoney?.amount,
        currency: payment.amountMoney?.currency,
        receiptNumber: payment.receiptNumber,
        receiptUrl: payment.receiptUrl
      }

      console.log('Sending success response:', responseData)

      return new Response(
        JSON.stringify(responseData),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    } else {
      throw new Error('Payment creation failed - no payment object returned')
    }

  } catch (error) {
    console.error('=== Square Payment Error ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    
    // Handle Square API errors
    if (error instanceof ApiError) {
      console.error('Square API Error:', error.errors)
      const errorResponse = {
        success: false,
        error: 'Payment processing failed',
        details: error.errors || error.message,
        timestamp: new Date().toISOString()
      }

      return new Response(
        JSON.stringify(errorResponse),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    const errorResponse = {
      success: false,
      error: error.message || 'Payment processing failed',
      details: error.toString(),
      timestamp: new Date().toISOString()
    }

    console.log('Sending error response:', errorResponse)

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})