-- Update prices to be more realistic based on distance and route type
UPDATE public.routes 
SET price = CASE 
  WHEN origin = 'New York' AND destination = 'Boston' THEN 89.00  -- 215 miles, premium train
  WHEN origin = 'Boston' AND destination = 'New York' THEN 89.00  -- Return route
  WHEN origin = 'New York' AND destination = 'Philadelphia' THEN 28.00  -- 95 miles, bus
  WHEN origin = 'Philadelphia' AND destination = 'New York' THEN 28.00  -- Return route
  WHEN origin = 'Chicago' AND destination = 'Detroit' THEN 125.00  -- 283 miles, long distance train
  ELSE price  -- Keep existing price if no match
END;