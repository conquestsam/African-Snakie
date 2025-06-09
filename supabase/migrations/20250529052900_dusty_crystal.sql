-- Database Schema for Snakie African Snacks Ecommerce

-- Users/Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Categories Table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Products Table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  inventory_count INTEGER NOT NULL DEFAULT 0,
  discount_percentage DECIMAL(5, 2),
  is_featured BOOLEAN DEFAULT false,
  vendor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Carts Table
CREATE TABLE carts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Cart Items Table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(cart_id, product_id)
);

-- Orders Table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(product_id, user_id)
);

-- Insert some initial data for testing

-- Categories
INSERT INTO categories (name, description, image_url) VALUES
('West African', 'Traditional snacks from West African countries including Nigeria, Ghana, and Senegal.', 'https://images.pexels.com/photos/7173123/pexels-photo-7173123.jpeg'),
('East African', 'Delicious treats from East African countries including Kenya, Tanzania, and Ethiopia.', 'https://images.pexels.com/photos/6823655/pexels-photo-6823655.jpeg'),
('North African', 'Tasty snacks from North African countries including Morocco, Egypt, and Tunisia.', 'https://images.pexels.com/photos/11437385/pexels-photo-11437385.jpeg'),
('South African', 'Flavorful snacks from South African countries including South Africa, Botswana, and Zimbabwe.', 'https://images.pexels.com/photos/5742258/pexels-photo-5742258.jpeg');

-- Products
INSERT INTO products (name, description, price, image_url, category_id, inventory_count, discount_percentage, is_featured, vendor_id) VALUES
('Nigerian Chin Chin', 'Crunchy, sweet fried pastry snack popular in Nigeria and other West African countries.', 9.99, 'https://images.pexels.com/photos/15913452/pexels-photo-15913452/free-photo-of-nigerian-chin-chin.jpeg', (SELECT id FROM categories WHERE name = 'West African'), 100, NULL, true, 'admin'),
('Ghanaian Plantain Chips', 'Crispy plantain chips fried to perfection. A popular snack in Ghana.', 7.99, 'https://images.pexels.com/photos/3756523/pexels-photo-3756523.jpeg', (SELECT id FROM categories WHERE name = 'West African'), 150, 10, true, 'admin'),
('Kenyan Mabuyu', 'Colorful, sweet and tangy baobab seeds. A popular Kenyan snack.', 8.99, 'https://images.pexels.com/photos/5718026/pexels-photo-5718026.jpeg', (SELECT id FROM categories WHERE name = 'East African'), 80, NULL, true, 'admin'),
('South African Biltong', 'Dried, cured meat snack similar to beef jerky. A South African favorite.', 12.99, 'https://images.pexels.com/photos/8365688/pexels-photo-8365688.jpeg', (SELECT id FROM categories WHERE name = 'South African'), 120, 5, true, 'admin'),
('Moroccan Spiced Nuts', 'Mix of nuts seasoned with traditional Moroccan spices. Sweet, savory, and spicy.', 11.99, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', (SELECT id FROM categories WHERE name = 'North African'), 90, NULL, true, 'admin'),
('Ethiopian Dabo Kolo', 'Small pieces of baked bread seasoned with spices. A perfect snack with coffee or tea.', 6.99, 'https://images.pexels.com/photos/7452250/pexels-photo-7452250.jpeg', (SELECT id FROM categories WHERE name = 'East African'), 110, NULL, true, 'admin'),
('Senegalese Chin Chin', 'Sweet fried pastry with a unique Senegalese twist.', 8.99, 'https://images.pexels.com/photos/6649645/pexels-photo-6649645.jpeg', (SELECT id FROM categories WHERE name = 'West African'), 75, 15, true, 'admin'),
('Egyptian Dukkah', 'Blend of herbs, nuts and spices used as a dip with bread and olive oil.', 10.99, 'https://images.pexels.com/photos/6941026/pexels-photo-6941026.jpeg', (SELECT id FROM categories WHERE name = 'North African'), 60, NULL, true, 'admin');

-- Create admin user (this would typically be done through the authentication system)
-- For demonstration purposes, we'll assume an admin user with this ID exists
INSERT INTO profiles (id, email, first_name, last_name, role) VALUES 
('00000000-0000-0000-0000-000000000000', 'admin@snakie.com', 'Admin', 'User', 'admin');

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_carts_modtime
BEFORE UPDATE ON carts
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_cart_items_modtime
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Allow admins to access all profiles
CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Products policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" 
  ON products FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can modify products" 
  ON products FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Categories policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" 
  ON categories FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can modify categories" 
  ON categories FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Cart policies
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cart" 
  ON carts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" 
  ON carts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart" 
  ON carts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Cart items policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cart items" 
  ON cart_items FOR SELECT 
  USING (
    cart_id IN (
      SELECT id FROM carts
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own cart items" 
  ON cart_items FOR UPDATE 
  USING (
    cart_id IN (
      SELECT id FROM carts
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert into their own cart items" 
  ON cart_items FOR INSERT 
  WITH CHECK (
    cart_id IN (
      SELECT id FROM carts
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own cart items" 
  ON cart_items FOR DELETE 
  USING (
    cart_id IN (
      SELECT id FROM carts
      WHERE user_id = auth.uid()
    )
  );

-- Orders policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Admins can view and update all orders
CREATE POLICY "Admins can view all orders" 
  ON orders FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders" 
  ON orders FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Order items policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items" 
  ON order_items FOR SELECT 
  USING (
    order_id IN (
      SELECT id FROM orders
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items" 
  ON order_items FOR INSERT 
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders
      WHERE user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" 
  ON order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Reviews policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" 
  ON reviews FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert their own reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON reviews FOR DELETE 
  USING (auth.uid() = user_id);