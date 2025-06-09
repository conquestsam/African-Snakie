import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log(`=== Stripe Checkout Request ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests FIRST - MUST return 200 status
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request - returning 200');
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    if (req.method !== 'POST') {
      console.log(`Method not allowed: ${req.method}`);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Processing checkout request...');

    // Check for required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');

    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseServiceKey,
      hasStripeKey: !!stripeSecret
    });

    if (!supabaseUrl) {
      console.error('SUPABASE_URL environment variable is missing');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Supabase URL' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!supabaseServiceKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is missing');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Supabase service key' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!stripeSecret) {
      console.error('STRIPE_SECRET_KEY environment variable is missing');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Stripe secret key' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Initialize clients after environment variable validation
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeSecret, {
      appInfo: {
        name: 'African Snakie',
        version: '1.0.0',
      },
    });

    console.log('Clients initialized successfully');

    // Parse request body
    let requestData;
    try {
      const requestText = await req.text();
      console.log('Raw request body:', requestText);
      
      if (!requestText) {
        throw new Error('Request body is empty');
      }
      
      requestData = JSON.parse(requestText);
      console.log('Parsed request data:', requestData);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { amount, success_url, cancel_url, mode = 'payment', metadata = {} } = requestData;

    // Validate required parameters
    if (!amount || typeof amount !== 'number') {
      console.error('Missing or invalid amount parameter:', amount);
      return new Response(
        JSON.stringify({ error: 'Missing or invalid amount parameter' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!success_url || typeof success_url !== 'string') {
      console.error('Missing or invalid success_url parameter:', success_url);
      return new Response(
        JSON.stringify({ error: 'Missing or invalid success_url parameter' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!cancel_url || typeof cancel_url !== 'string') {
      console.error('Missing or invalid cancel_url parameter:', cancel_url);
      return new Response(
        JSON.stringify({ error: 'Missing or invalid cancel_url parameter' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!['payment', 'subscription'].includes(mode)) {
      console.error('Invalid mode parameter:', mode);
      return new Response(
        JSON.stringify({ error: 'Mode must be either "payment" or "subscription"' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Get and validate authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Authorization header is missing');
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Authenticating user...');
    
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError) {
      console.error('Failed to authenticate user:', getUserError);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate user' }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!user) {
      console.error('User not found');
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log(`Authenticated user: ${user.id}`);

    // Check if customer exists in our database
    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Failed to fetch customer information:', getCustomerError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch customer information' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    let customerId;

    // Create new customer if doesn't exist
    if (!customer || !customer.customer_id) {
      console.log('Creating new Stripe customer...');
      try {
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });

        console.log(`Created new Stripe customer ${newCustomer.id} for user ${user.id}`);

        const { error: createCustomerError } = await supabase.from('stripe_customers').insert({
          user_id: user.id,
          customer_id: newCustomer.id,
        });

        if (createCustomerError) {
          console.error('Failed to save customer information:', createCustomerError);
          
          // Cleanup Stripe customer if database insert failed
          try {
            await stripe.customers.del(newCustomer.id);
          } catch (deleteError) {
            console.error('Failed to cleanup Stripe customer:', deleteError);
          }

          return new Response(
            JSON.stringify({ error: 'Failed to create customer mapping' }),
            {
              status: 500,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            }
          );
        }

        // Create subscription record if needed
        if (mode === 'subscription') {
          const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
            customer_id: newCustomer.id,
            status: 'not_started',
          });

          if (createSubscriptionError) {
            console.error('Failed to create subscription record:', createSubscriptionError);
            return new Response(
              JSON.stringify({ error: 'Failed to create subscription record' }),
              {
                status: 500,
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                },
              }
            );
          }
        }

        customerId = newCustomer.id;
      } catch (stripeError: any) {
        console.error('Stripe customer creation failed:', stripeError);
        return new Response(
          JSON.stringify({ error: `Failed to create Stripe customer: ${stripeError.message}` }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } else {
      customerId = customer.customer_id;
      console.log(`Using existing customer: ${customerId}`);

      // Ensure subscription record exists for existing customers
      if (mode === 'subscription') {
        const { data: subscription, error: getSubscriptionError } = await supabase
          .from('stripe_subscriptions')
          .select('status')
          .eq('customer_id', customerId)
          .maybeSingle();

        if (getSubscriptionError) {
          console.error('Failed to fetch subscription information:', getSubscriptionError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch subscription information' }),
            {
              status: 500,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            }
          );
        }

        if (!subscription) {
          const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
            customer_id: customerId,
            status: 'not_started',
          });

          if (createSubscriptionError) {
            console.error('Failed to create subscription record for existing customer:', createSubscriptionError);
            return new Response(
              JSON.stringify({ error: 'Failed to create subscription record' }),
              {
                status: 500,
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                },
              }
            );
          }
        }
      }
    }

    // Create Stripe checkout session with dynamic pricing
    try {
      console.log('Creating Stripe checkout session...');
      console.log('Session parameters:', {
        customer: customerId,
        mode,
        amount: amount,
        currency: 'usd'
      });

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'African Snakie Order',
                description: 'Authentic African snacks and delicacies',
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode,
        success_url,
        cancel_url,
        metadata: {
          userId: user.id,
          ...metadata
        },
      });

      console.log(`Created checkout session ${session.id} for customer ${customerId}`);

      return new Response(
        JSON.stringify({ 
          sessionId: session.id, 
          url: session.url 
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );

    } catch (stripeError: any) {
      console.error('Stripe checkout session creation failed:', stripeError);
      return new Response(
        JSON.stringify({ error: `Failed to create checkout session: ${stripeError.message}` }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

  } catch (error: any) {
    console.error(`Unexpected error in stripe-checkout function:`, error);
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});