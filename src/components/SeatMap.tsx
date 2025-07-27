import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Seat {
  id: string;
  seat_number: string;
  is_booked: boolean;
  booked_by?: string;
}

interface SeatMapProps {
  seats: Seat[];
  selectedSeat: string | null;
  onSeatSelect: (seatNumber: string) => void;
  onConfirmBooking: () => void;
  isLoading?: boolean;
}

export const SeatMap = ({ 
  seats, 
  selectedSeat, 
  onSeatSelect, 
  onConfirmBooking, 
  isLoading 
}: SeatMapProps) => {
  // Group seats by row (A, B, C, etc.)
  const seatRows = seats.reduce((acc, seat) => {
    const row = seat.seat_number.charAt(0);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort rows alphabetically and seats by number
  const sortedRows = Object.keys(seatRows).sort();
  sortedRows.forEach(row => {
    seatRows[row].sort((a, b) => 
      parseInt(a.seat_number.slice(1)) - parseInt(b.seat_number.slice(1))
    );
  });

  const getSeatClassName = (seat: Seat) => {
    if (seat.is_booked) return "seat-booked";
    if (selectedSeat === seat.seat_number) return "seat-selected";
    return "seat-available";
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Seat Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border-2 seat-available flex items-center justify-center text-xs">
              A1
            </div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border-2 seat-selected flex items-center justify-center text-xs">
              A2
            </div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border-2 seat-booked flex items-center justify-center text-xs">
              A3
            </div>
            <span className="text-sm">Booked</span>
          </div>
        </div>
      </Card>

      {/* Seat Map */}
      <Card className="p-6">
        <div className="mb-4">
          <div className="w-full h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-6">
            <span className="text-sm font-medium text-muted-foreground">DRIVER</span>
          </div>
        </div>

        <div className="space-y-4">
          {sortedRows.map(row => (
            <div key={row} className="flex items-center gap-3">
              <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                {row}
              </Badge>
              
              <div className="flex gap-2">
                {seatRows[row].slice(0, 2).map(seat => (
                  <Button
                    key={seat.seat_number}
                    variant="outline"
                    size="icon"
                    className={`w-12 h-12 text-xs font-medium ${getSeatClassName(seat)}`}
                    onClick={() => !seat.is_booked && onSeatSelect(seat.seat_number)}
                    disabled={seat.is_booked}
                  >
                    {seat.seat_number}
                  </Button>
                ))}
              </div>

              {/* Aisle */}
              <div className="w-8 flex justify-center">
                <div className="w-px h-8 bg-border"></div>
              </div>

              <div className="flex gap-2">
                {seatRows[row].slice(2).map(seat => (
                  <Button
                    key={seat.seat_number}
                    variant="outline"
                    size="icon"
                    className={`w-12 h-12 text-xs font-medium ${getSeatClassName(seat)}`}
                    onClick={() => !seat.is_booked && onSeatSelect(seat.seat_number)}
                    disabled={seat.is_booked}
                  >
                    {seat.seat_number}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Booking Confirmation */}
      {selectedSeat && (
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Selected Seat: {selectedSeat}</h4>
              <p className="text-sm text-muted-foreground">Ready to book this seat?</p>
            </div>
            <Button 
              variant="accent" 
              onClick={onConfirmBooking}
              disabled={isLoading}
            >
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};