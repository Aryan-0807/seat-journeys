-- Create routes table
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('train', 'bus')),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  vehicle_number TEXT NOT NULL,
  seats_total INTEGER NOT NULL DEFAULT 40,
  price DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seats table
CREATE TABLE public.seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT FALSE,
  booked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(route_id, seat_number)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled')),
  booked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for routes (public read access)
CREATE POLICY "Routes are viewable by everyone" 
ON public.routes FOR SELECT 
USING (true);

-- RLS Policies for seats (public read, authenticated users can update for booking)
CREATE POLICY "Seats are viewable by everyone" 
ON public.seats FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can update seats for booking" 
ON public.seats FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for bookings (users can only see/manage their own)
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample routes
INSERT INTO public.routes (type, origin, destination, departure_time, arrival_time, vehicle_number, seats_total, price) VALUES
('train', 'New York', 'Boston', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '6 hours', 'TR001', 40, 75.00),
('train', 'Boston', 'New York', NOW() + INTERVAL '4 hours', NOW() + INTERVAL '8 hours', 'TR002', 40, 75.00),
('bus', 'New York', 'Philadelphia', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours', 'BUS001', 30, 35.00),
('bus', 'Philadelphia', 'New York', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '5 hours', 'BUS002', 30, 35.00),
('train', 'Chicago', 'Detroit', NOW() + INTERVAL '5 hours', NOW() + INTERVAL '9 hours', 'TR003', 40, 65.00);

-- Function to generate seats for a route
CREATE OR REPLACE FUNCTION public.generate_seats_for_route(route_uuid UUID, total_seats INTEGER)
RETURNS VOID AS $$
DECLARE
  i INTEGER;
  seat_letter CHAR(1);
  seat_number TEXT;
BEGIN
  FOR i IN 1..total_seats LOOP
    -- Generate seat numbers like A1, B1, A2, B2, etc.
    seat_letter := CASE WHEN i % 2 = 1 THEN 'A' ELSE 'B' END;
    seat_number := seat_letter || ((i + 1) / 2)::TEXT;
    
    INSERT INTO public.seats (route_id, seat_number, is_booked)
    VALUES (route_uuid, seat_number, FALSE);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate seats for all existing routes
DO $$
DECLARE
  route_record RECORD;
BEGIN
  FOR route_record IN SELECT id, seats_total FROM public.routes LOOP
    PERFORM public.generate_seats_for_route(route_record.id, route_record.seats_total);
  END LOOP;
END;
$$;