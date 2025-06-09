import Stripe from 'npm:stripe@14.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  console.log('=== Payment Intent Request ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))

  // Handle CORS preflight requests - MUST return 200 status
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request - returning 200')
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
    console.log('Processing payment intent creation...')
    
    // Use the secret key directly
    const stripeSecretKey = 'sk_test_51RWFyQQ0TdV0Jwd7zNi0P7KqGSe2dhfbNZVUUCgu1761QZ0J4bOP3nlkUOmXX7ekPvgh8tMW3mtgDOiNrt14cYDK007jBb2aHz'
    
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured')
    }

    console.log('Initializing Stripe...')
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
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

    const { amount, orderId, currency = 'usd' } = requestData

    if (!amount || !orderId) {
      throw new Error('Amount and orderId are required')
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(parseFloat(amount) * 100)

    console.log('Creating payment intent with:', {
      amountInDollars: amount,
      amountInCents,
      currency,
      orderId
    })

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId,
      },
      description: `African Snakie Order #${orderId.slice(0, 8)}`,
    })

    console.log('Payment intent created successfully:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    })

    const responseData = {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    }

    console.log('Sending response:', responseData)

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
  } catch (error) {
    console.error('=== Payment Intent Error ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    const errorResponse = {
      error: error.message || 'Failed to create payment intent',
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