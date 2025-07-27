-- Clear existing routes and seats
DELETE FROM public.seats;
DELETE FROM public.routes;

-- Insert Indian routes with realistic pricing
INSERT INTO public.routes (type, origin, destination, departure_time, arrival_time, vehicle_number, seats_total, price) VALUES
-- Mumbai routes
('train', 'Mumbai', 'Delhi', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '18 hours', 'RAJDHANI-12951', 72, 2850.00),
('train', 'Mumbai', 'Bangalore', NOW() + INTERVAL '4 hours', NOW() + INTERVAL '24 hours', 'UDYAN-EXP-11301', 72, 1890.00),
('bus', 'Mumbai', 'Pune', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '4 hours', 'MH-12-AC-1234', 45, 350.00),

-- Delhi routes  
('train', 'Delhi', 'Mumbai', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '19 hours', 'RAJDHANI-12952', 72, 2850.00),
('train', 'Delhi', 'Kolkata', NOW() + INTERVAL '5 hours', NOW() + INTERVAL '22 hours', 'DURONTO-12273', 72, 2450.00),
('bus', 'Delhi', 'Jaipur', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '7 hours', 'RJ-14-AC-5678', 40, 480.00),

-- Bangalore routes
('train', 'Bangalore', 'Chennai', NOW() + INTERVAL '6 hours', NOW() + INTERVAL '11 hours', 'SHATABDI-12007', 64, 980.00),
('train', 'Bangalore', 'Hyderabad', NOW() + INTERVAL '8 hours', NOW() + INTERVAL '20 hours', 'KACHEGUDA-EXP', 72, 1250.00),
('bus', 'Bangalore', 'Mysore', NOW() + INTERVAL '1.5 hours', NOW() + INTERVAL '4.5 hours', 'KA-09-AC-9876', 35, 280.00),

-- Other popular routes
('train', 'Chennai', 'Bangalore', NOW() + INTERVAL '7 hours', NOW() + INTERVAL '12 hours', 'SHATABDI-12008', 64, 980.00),
('train', 'Kolkata', 'Delhi', NOW() + INTERVAL '9 hours', NOW() + INTERVAL '26 hours', 'DURONTO-12274', 72, 2450.00),
('bus', 'Pune', 'Mumbai', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '6 hours', 'MH-12-AC-4321', 45, 350.00);

-- Generate seats for all routes
DO $$
DECLARE
  route_record RECORD;
BEGIN
  FOR route_record IN SELECT id, seats_total FROM public.routes LOOP
    PERFORM public.generate_seats_for_route(route_record.id, route_record.seats_total);
  END LOOP;
END;
$$;