
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { Trash2, Edit, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

interface BookingCardProps {
  booking: Booking;
  onEdit?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  showActions?: boolean;
}

export const BookingCard = ({ booking, onEdit, onCancel, showActions = true }: BookingCardProps) => {
  const formatDisplayDate = (dateStr: string) => {
    try {
      return format(parseISO(`${dateStr}T00:00:00`), 'MMMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const displayDate = formatDisplayDate(booking.date);

  return (
    <Card className="overflow-hidden">
      <div 
        className={`h-2 w-full ${
          booking.status === 'confirmed' ? 'bg-booking-success' : 
          booking.status === 'pending' ? 'bg-booking-pending' : 
          booking.status === 'rejected' ? 'bg-booking-error' : 
          'bg-booking-dark'
        }`} 
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium truncate">{booking.purpose}</h3>
          <StatusBadge status={booking.status} />
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{booking.classroomName}</p>
        
        <div className="flex items-center text-sm mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>{booking.startTime} - {booking.endTime}</span>
          <span className="mx-2">•</span>
          <span>{displayDate}</span>
        </div>
        
        <p className="text-xs text-muted-foreground">Booked by: {booking.userName}</p>
      </CardContent>
      
      {showActions && booking.status !== 'cancelled' && booking.status !== 'rejected' && (
        <CardFooter className="flex justify-end p-4 pt-0 gap-2">
          {onEdit && booking.status === 'pending' && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(booking)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
          {onCancel && (booking.status === 'confirmed' || booking.status === 'pending') && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onCancel(booking)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Cancel
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
