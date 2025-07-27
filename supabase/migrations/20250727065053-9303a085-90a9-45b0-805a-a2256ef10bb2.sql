-- Fix security issues for database functions
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.generate_seats_for_route(UUID, INTEGER) SET search_path = '';