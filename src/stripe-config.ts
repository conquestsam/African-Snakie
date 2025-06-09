export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1RY54mQ0TdV0Jwd7D4XqY0xO',
    name: 'Samosa',
    description: 'Dried, cured samosa snack similar to beef jerky. A nigerian African favorite.',
    mode: 'payment',
    price: 2.50
  },
  {
    priceId: 'price_1RY53JQ0TdV0Jwd7dSkxVCOX',
    name: 'Money Bag',
    description: 'Money Bag Chips',
    mode: 'payment',
    price: 2.50
  },
  {
    priceId: 'price_1RY51fQ0TdV0Jwd7PAb3FLkX',
    name: 'Puff Puff',
    description: 'We have hot succulent puff puff 5 pcs.',
    mode: 'payment',
    price: 4.00
  },
  {
    priceId: 'price_1RY50oQ0TdV0Jwd7rIl2grW5',
    name: 'Spring Roll',
    description: 'Spring Roll 5 pcs.',
    mode: 'payment',
    price: 4.00
  },
  {
    priceId: 'price_1RY4y8Q0TdV0Jwd7r0svlzeS',
    name: 'Jollof Rice with Chicken',
    description: 'This is a special delicacy.',
    mode: 'payment',
    price: 10.00
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getProductByName(name: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.name.toLowerCase() === name.toLowerCase());
}