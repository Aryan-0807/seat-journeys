import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: '#1e40af',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#1e40af',
    borderRadius: 8,
    marginRight: 12,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  ticketNumber: {
    fontSize: 12,
    color: '#6b7280',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1f2937',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e2e8f0',
  },
  cityInfo: {
    flex: 1,
    alignItems: 'center',
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  cityCode: {
    fontSize: 14,
    color: '#6b7280',
  },
  arrow: {
    fontSize: 24,
    color: '#1e40af',
    marginHorizontal: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  detailItem: {
    width: '50%',
    marginBottom: 20,
    paddingRight: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  seatInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
  },
  seatLabel: {
    fontSize: 14,
    color: '#1e40af',
    marginRight: 10,
  },
  seatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  qrCodePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 8,
    color: '#9ca3af',
  },
});

interface TicketData {
  id: string;
  routeId: string;
  seatNumber: string;
  route: {
    type: 'train' | 'bus';
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    vehicleNumber: string;
    price: number;
  };
  bookedAt: string;
}

interface TicketPDFProps {
  booking: TicketData;
}

export const TicketPDF: React.FC<TicketPDFProps> = ({ booking }) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      }),
    };
  };

  const departure = formatDateTime(booking.route.departureTime);
  const arrival = formatDateTime(booking.route.arrivalTime);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <View style={styles.logoIcon} />
            <View>
              <Text style={styles.companyName}>SeatJourneys</Text>
              <Text style={styles.ticketNumber}>Ticket #{booking.id.slice(0, 8).toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {booking.route.type === 'train' ? '🚂 Train Ticket' : '🚌 Bus Ticket'}
        </Text>

        {/* Route Information */}
        <View style={styles.routeContainer}>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{booking.route.origin}</Text>
            <Text style={styles.cityCode}>DEPARTURE</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{booking.route.destination}</Text>
            <Text style={styles.cityCode}>ARRIVAL</Text>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Vehicle</Text>
            <Text style={styles.detailValue}>{booking.route.vehicleNumber}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Departure Date</Text>
            <Text style={styles.detailValue}>{departure.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Departure Time</Text>
            <Text style={styles.detailValue}>{departure.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Arrival Time</Text>
            <Text style={styles.detailValue}>{arrival.time}</Text>
          </View>
        </View>

        {/* Seat Information */}
        <View style={styles.seatInfo}>
          <Text style={styles.seatLabel}>SEAT NUMBER:</Text>
          <Text style={styles.seatNumber}>{booking.seatNumber}</Text>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Amount Paid</Text>
          <Text style={styles.price}>₹{booking.route.price.toFixed(2)}</Text>
        </View>

        {/* QR Code Placeholder */}
        <View style={styles.qrCodePlaceholder}>
          <Text style={styles.qrText}>QR CODE</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing SeatJourneys! Please arrive at the station 30 minutes before departure.{'\n'}
            Present this ticket along with a valid ID for boarding. Safe travels!{'\n\n'}
            Booked on: {new Date(booking.bookedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

interface DownloadTicketButtonProps {
  booking: TicketData;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const DownloadTicketButton: React.FC<DownloadTicketButtonProps> = ({ 
  booking, 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  return (
    <PDFDownloadLink
      document={<TicketPDF booking={booking} />}
      fileName={`ticket-${booking.route.origin}-${booking.route.destination}-${booking.seatNumber}.pdf`}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
        variant === 'outline' 
          ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      } ${
        size === 'sm' ? 'h-9 px-3' : size === 'lg' ? 'h-11 px-8' : 'h-10 px-4 py-2'
      } ${className}`}
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generating...' : '📄 Download Ticket'
      }
    </PDFDownloadLink>
  );
};